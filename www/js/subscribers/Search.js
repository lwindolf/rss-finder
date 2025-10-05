// vim: set ts=4 sw=4:
import { Subscriber } from "../Subscriber.js";
import * as r from "../helpers/render.js";

// Search the RSS feed index from https://github.com/lwindolf/rss-feed-index

export class SubscriberImpl extends Subscriber {
        static name = "Search";
        static favicon = "default.svg";
        static title = "Search RSS Feed Index";

        static #index;
        static #flatIndex;
        static #template = r.template(`
                {{#each results}}
                        {{#each feeds}}
                        <div class="result block">
                            <div class='resultInfo'>
                                <div class='resultDetails' data-url='{{u}}'>
                                    <div class='resultTitle'><a class="domain" href="{{../domain}}"><span class="highlightText">{{../domainName}}</span></a> -- <span class="highlightText">{{#if n}}{{n}}{{else}}{{u}}{{/if}}</span>
                                        <span class='resultGenre' style='float: right;'>
                                                {{#if t}}<span title="This feed has rich text content.">Long text</span>{{/if}}
                                                {{#compare m '&' 1}}<span title="Podcast">&#127911;</span>{{/compare}}
                                                {{#compare m '&' 2}}<span title="Video">&#127916;</span>{{/compare}}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {{/each}}
                {{/each}}`);

        #results;       // DOM node for results display

        constructor(el) {
                super();
                this.#render(el);
        }

        async #loadData() {
                const response = await fetch('data/url-title.json');
                const reader = response.body.getReader();

                let receivedLength = 0; // received that many bytes at the moment
                let chunks = []; // array of received binary chunks (comprises the body)
                // eslint-disable-next-line no-constant-condition
                while(true) {
                        const {done, value} = await reader.read();
                        if (done)
                                break;

                        chunks.push(value);
                        receivedLength += value.length;
                        this.#results.innerHTML = `Loading ... ${ (receivedLength / 1024 / 1024).toFixed(2) } MB`;
                }

                // concatenate chunks into single Uint8Array
                let chunksAll = new Uint8Array(receivedLength);
                let position = 0;
                for(let chunk of chunks) {
                        chunksAll.set(chunk, position);
                        position += chunk.length;
                }
                
                // decode into a string
                return JSON.parse(new TextDecoder("utf-8").decode(chunksAll));
        }

        // Map a list of domains to [{domain, feeds}] list for result rendering
        // Also expands protocol of domain if missing and expands relative feed URLs
        #mapDomainList(list) {
                return list.sort().map(domain => {
                        const withProto = domain.includes('://') ? domain : 'https://' + domain;
                        return {
                                domainName: domain,
                                domain: withProto,
                                feeds: Object.values(SubscriberImpl.#index[domain]).map(feed => {
                                        if (feed.u[0] === '/')
                                                feed.u = withProto + feed.u;
                                            if (!feed.u.includes('://'))
                                                feed.u = 'https://' + feed.u;
                                        return feed;
                                })
                        }
                });
        }

        #loadRandom() {
                let list = Object.keys(SubscriberImpl.#index);
                const offset = Math.floor(Math.random() * (list.length - 100));
                list = list.slice(offset, offset + 100);

                this.#results.innerHTML = '<h2>100 Random Feeds</h2>';
                r.renderElement(this.#results, SubscriberImpl.#template, {
                        results: this.#mapDomainList(list)
                });
        }

        async #render(el) {
                el.innerHTML = `
                <form id="search-form" class="block">
                        <p>Search over 150,000 RSS feeds</p>
                        <input type="text" id="search" placeholder="Search for a domain / feed name..." disabled />
                </form>
                <div id="results">Loading ...</div>
                `;

                this.#results = el.querySelector('#results');
                const searchInput = el.querySelector('#search');

                try {
                        SubscriberImpl.#index = await this.#loadData();
                } catch (error) {
                        el.innerHTML = `<div class="subscriber-error">Failed to load search index: ${error.message}</div>`;
                        return;
                }

                if(!SubscriberImpl.#index || SubscriberImpl.#index.length === 0) {
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
                                this.preview(result.querySelector('.resultDetails').dataset.url, result);
                        }
                });
        }

        #performSearch(event) {
                const query = event.target.value.toLowerCase();
                console.log(`Searching for ${query}`);

                if(!SubscriberImpl.#flatIndex) {
                        // flatten the data structure to a list of {domain, url, name}
                        SubscriberImpl.#flatIndex = Object.keys(SubscriberImpl.#index).map(domain => {
                                // eslint-disable-next-line no-unused-vars
                                return Object.entries(SubscriberImpl.#index[domain]).map(([i, v]) => {
                                        return { domain, v };
                                });
                        }).flat();
                }
                const list = SubscriberImpl.#flatIndex.filter(e =>
                        e.v.u.toLowerCase().includes(query) ||
                        e.v.n.toLowerCase().includes(query) ||
                        e.domain.toLowerCase().includes(query)
                ).map(e => e.domain);

                this.#results.innerHTML = `<h2>Search Results (${list.length})</h2>`;
                r.renderElement(this.#results, SubscriberImpl.#template, {
                        results: this.#mapDomainList(list.slice(0, 100))
                });

                if(query.length > 2) {
                        // Highlight search term in results
                        const results = this.#results.querySelectorAll('.result .highlightText');
                        results.forEach(link => {
                                const regex = new RegExp(`(${query})`, 'gi');
                                const newContent = link.textContent.replace(regex, '<span class="highlight">$1</span>');
                                link.innerHTML = newContent;
                        });
                }

                if(list.length === 0)
                        this.#results.innerHTML += '<p>No results found. Try a different search term.</p>';
                if(list.length == 100)
                        this.#results.innerHTML += '<p>Showing first 100 results only. Please refine your search.</p>';

        }
}