// vim: set ts=4 sw=4:
import { Subscriber } from "../Subscriber.js";
import * as r from "../helpers/render.js";

// Search the blogroll index from https://github.com/lwindolf/rss-feed-index
// allow loading blogrolls to show feeds and selecting them to load them
// like a tiny feed reader

export class SubscriberImpl extends Subscriber {
    static name = "Blogrolls";
    static favicon = "opml-icon-64x64.png";
    static title = "Search Blogrolls";

    static #index;
    static #template = r.template(`
        {{#each results}}
            <div class="result block">
                <div class='resultInfo'>
                    {{#with blogroll}}
                    <div class='resultDetails' data-url='{{opml}}'>
                            <div class='resultTitle highlightText'>
                                <a href="{{opml}}">
                                    {{#if t}}
                                            {{t}}
                                    {{else}}
                                            {{u}}
                                    {{/if}}
                                </a>
                            </div>
                    </div>
                    {{/with}}
                </div>
            </div>
        {{/each}}`);

    static #templateOPML = r.template(`
        {{#*inline "outlineBlock"}}
            {{#each children}}
                <div class="outline">
                    {{#if url}}
                        <div class="feed" data-url="{{url}}">{{text}}</div>
                    {{else}}
                        {{#if children}}
                        <div class="folder">📂 {{text}}</div>
                        <div class="folderChildren">
                            {{> outlineBlock}}
                        </div>
                        {{/if}}
                    {{/if}}
                </div>
            {{/each}}
        {{/inline}}

        <div class="blogroll">
            <div class="blogs">
                {{> outlineBlock}}
            </div>
            <div class="blogrollPreview">
            </div>
        </div>
    `);

    #results;       // DOM node for results display

    constructor(el) {
        super();
        this.#render(el);
    }

    async #loadData() {
        const response = await fetch('data/blogroll.json');
        const reader = response.body.getReader();

        let receivedLength = 0; // received that many bytes at the moment
        let chunks = []; // array of received binary chunks (comprises the body)
        // eslint-disable-next-line no-constant-condition
        while (true) {
            const { done, value } = await reader.read();
            if (done)
                break;

            chunks.push(value);
            receivedLength += value.length;
            this.#results.innerHTML = `Loading ... ${(receivedLength / 1024 / 1024).toFixed(2)} MB`;
        }

        // concatenate chunks into single Uint8Array
        // eslint-disable-next-line no-undef
        let chunksAll = new Uint8Array(receivedLength);
        let position = 0;
        for (let chunk of chunks) {
            chunksAll.set(chunk, position);
            position += chunk.length;
        }

        // decode into a string
        return JSON.parse(new TextDecoder("utf-8").decode(chunksAll));
    }

    // Map a list of domains to [{domain, feeds}] list for result rendering
    // Also expands protocol of domain if missing and expands relative feed URLs
    #mapDomainList(list) {
        return list.sort().map(name => {
            return { blogroll: { ...SubscriberImpl.#index[name], opml: name } };
        });
    }

    #loadRandom() {
        let list = Object.keys(SubscriberImpl.#index);
        const offset = Math.floor(Math.random() * (list.length - 100));
        list = list.slice(offset, offset + 100);

        this.#results.innerHTML = '<h2>100 Random Blogrolls</h2>';
        r.renderElement(this.#results, SubscriberImpl.#template, {
            results: this.#mapDomainList(list)
        });
    }

    async #loadOPML(url, el) {
        const div = document.createElement("div");
        div.className = "preview";
        div.innerText = `Fetching ${url}...`;
        this.#results.querySelectorAll(".preview").forEach(e => e.remove());
        el.appendChild(div);
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        try {
            // Load the OPML file and display it in a preview
            await fetch(url, { allowCorsProxy: true })
                .then(response => {
                    if(response.status && response.status > 399)
                        throw new Error('HTTP ' + response.status + " " + response.statusText);
                    return response.text()
                })
                .then(data => {
                    const parser = new DOMParser();
                    const xmlDoc = parser.parseFromString(data, 'text/xml');

                    const errorNode = xmlDoc.getElementsByTagName("parsererror")[0];
                    if (errorNode)
                        throw new Error('Error parsing OPML: ' + errorNode.textContent);

                    const parseOutlines = (parent) => {
                        const result = { children: [] };
                        const outlines = parent.querySelectorAll(':scope > outline');
                        outlines.forEach(outline => {
                            const text = outline.getAttribute('text');
                            if(!text)
                                return;
                            const textStr = new DOMParser().parseFromString(text, 'text/html').documentElement.textContent
                            const xmlUrl = outline.getAttribute('xmlUrl');
                            if (xmlUrl) {
                                result.children.push({
                                    text: textStr,
                                    url: xmlUrl
                                });
                            } else {
                                result.children.push({
                                    text: textStr,
                                    children: parseOutlines(outline).children
                                });
                            }
                        });
                        return result;
                    };
                    const body = xmlDoc.querySelector('body') || xmlDoc.documentElement;
                    this.#renderOPML(div, parseOutlines(body));
                })
        } catch(e) {
            div.innerText = 'Error when loading OPML! ' + e.message;
            console.error('Error when loading OPML!', e);
        }
    }

    async #renderOPML(el, outlines) {
        r.renderElement(el, SubscriberImpl.#templateOPML, outlines);

        const blogroll = el.querySelector(".blogroll");
        blogroll.querySelectorAll(".feed").forEach((feed) => {
            feed.addEventListener("click", (ev) => {
                el.querySelectorAll(`.blogs .feed.selected`).forEach(e => e.classList.remove("selected"));
                el.querySelector(`.blogs .feed[data-url='${feed.dataset.url}']`).classList.add("selected");
                this.preview(feed.dataset.url, blogroll.querySelector(".blogrollPreview"))
                ev.stopPropagation();
            });
        });
    }

    async #render(el) {
        el.innerHTML = `
                <form id="search-form" class="block">
                        <p>Search all blogrolls</p>
                        <input type="text" id="search" placeholder="Search for a domain / blogroll URL / title ..." disabled />
                </form>
                <div id="results">Loading ...</div>
                `;

        this.#results = el.querySelector('#results');
        const searchInput = el.querySelector('#search');

        try {
            SubscriberImpl.#index = (await this.#loadData()).blogrolls;
        } catch (error) {
            el.innerHTML = `<div class="subscriber-error">Failed to load search index: ${error.message}</div>`;
            return;
        }

        if (!SubscriberImpl.#index || SubscriberImpl.#index.length === 0) {
            el.innerHTML = `<div class="subscriber-error">Failed to load search index</div>`;
            return;
        }

        searchInput.disabled = false;
        searchInput.focus();
        searchInput.addEventListener('input', this.#performSearch.bind(this));
        this.#loadRandom();

        this.#results.addEventListener('click', (ev) => {
            const result = ev.target.closest('.result');
            if (result) {
                ev.preventDefault();
                this.#loadOPML(result.querySelector('.resultDetails').dataset.url, result);
            }
        });
    }

    #performSearch(event) {
        const query = event.target.value.toLowerCase();
        console.log(`Searching for ${query}`);

        const list = Object.keys(SubscriberImpl.#index).filter(url =>
            SubscriberImpl.#index[url].u?.toLowerCase().includes(query) ||
            SubscriberImpl.#index[url].t?.toLowerCase().includes(query)
        );

        this.#results.innerHTML = `<h2>Search Results (${list.length})</h2>`;
        r.renderElement(this.#results, SubscriberImpl.#template, {
            results: this.#mapDomainList(list.slice(0, 100))
        });

        if (query.length > 2) {
            // Highlight search term in results
            const results = this.#results.querySelectorAll('.result .highlightText');
            results.forEach(link => {
                const regex = new RegExp(`(${query})`, 'gi');
                const newContent = link.textContent.replace(regex, '<span class="highlight">$1</span>');
                link.innerHTML = newContent;
            });
        }

        if (list.length === 0)
            this.#results.innerHTML += '<p>No results found. Try a different search term.</p>';
        if (list.length == 100)
            this.#results.innerHTML += '<p>Showing first 100 results only. Please refine your search.</p>';

    }
}