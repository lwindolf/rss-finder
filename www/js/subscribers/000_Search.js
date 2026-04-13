// vim: set ts=4 sw=4:
import { Subscriber } from "../Subscriber.js";
import * as r from "../helpers/render.js";

// Search the RSS feed index from https://github.com/lwindolf/rss-feed-index

export class SubscriberImpl extends Subscriber {
        static name = "Search";
        static favicon = "default.svg";
        static title = "Search RSS Feed Index";

        static #meta;
        static #index;
        static #template = `
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
                                                {{#compare ../minor '&' 1}}<span title="author is part of the Fediverse">Fediverse</span>{{/compare}}
                                                {{#compare ../minor '&' 2}}<span title="Blog is an Indieweb blog">Indieweb</span>{{/compare}}
                                                {{#compare ../minor '&' 16}}<span title="Blog is an Wordpress blog">Wordpress</span>{{/compare}}
                                                {{../major}}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {{/each}}
                {{/each}}`;

        #results;       // DOM node for results display

        constructor(el) {
                super();
                this.#render(el);
        }

        async #loadData(el) {
                if(SubscriberImpl.#index)
                        return;

                SubscriberImpl.#meta = await fetch(window.RssFinder.settings['base-path'] + '/data/meta.json').then(res => res.json());
                const response = await fetch(window.RssFinder.settings['base-path'] + '/data/url-feeds.json');
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
                        el.innerHTML = `Loading ... ${ (receivedLength / 1024 / 1024).toFixed(2) } MB`;
                }

                // concatenate chunks into single Uint8Array
                // eslint-disable-next-line no-undef
                let chunksAll = new Uint8Array(receivedLength);
                let position = 0;
                for(let chunk of chunks) {
                        chunksAll.set(chunk, position);
                        position += chunk.length;
                }
                
                // decode into a string
                SubscriberImpl.#index = JSON.parse(new TextDecoder("utf-8").decode(chunksAll));
        }

        // Map a list of urls to [{url, feeds}] list for result rendering
        // Also expands protocol of url if missing and expands relative feed URLs
        #mapDomainList(list) {
                return list.sort().map(url => {
                        if(!SubscriberImpl.#index[url])
                                return;

                        const withProto = url.includes('://') ? url : 'https://' + url;
                        return {
                                domainName: url,
                                domain: withProto,
                                minor: SubscriberImpl.#index[url]?.M,
                                blogroll: SubscriberImpl.#index[url]?.b,
                                feeds: Object.values(SubscriberImpl.#index[url].f).map(feed => {
                                        if (feed.u[0] === '/')
                                                feed.u = withProto + feed.u;
                                            if (!feed.u.includes('://'))
                                                feed.u = 'https://' + feed.u;
                                        return feed;
                                })
                        }
                });
        }

        #loadRandom(el) {
                let list = Object.keys(SubscriberImpl.#index);
                const offset = Math.floor(Math.random() * (list.length - 100));
                list = list.slice(offset, offset + 100);

                el.innerHTML = '<h2>100 Random Feeds</h2>' +
                        r.renderToString(SubscriberImpl.#template, {
                                results: this.#mapDomainList(list)
                        });
        }

        async #render(el) {
                el.innerHTML = `<div id="results">Loading ...</div>`;

                try {
                        await this.#loadData(el.querySelector('#results'));
                } catch (error) {
                        el.innerHTML = `<div class="subscriber-error">Failed to load search index: ${error.message}</div>`;
                        return;
                }

                if(!SubscriberImpl.#index || SubscriberImpl.#index.length === 0) {
                        el.innerHTML = `<div class="subscriber-error">Failed to load search index</div>`;
                        return;
                }

                el.innerHTML = `
                <form id="search-form" class="block">
                        <p>Search over ${Math.floor(SubscriberImpl.#meta.feeds / 10000) * 10000} RSS feeds</p>
                        <input type="text" id="search" placeholder="Search for a domain / feed name..." disabled />
                        <div>
                                <input type="checkbox" id="longtext" /> <label for="longtext" title="Search only feeds with long text content">Long Text</label>
                                <input type="checkbox" id="audio" /> <label for="audio" title="Search only feeds with embedded audio">Podcast</label>
                                <input type="checkbox" id="video" /> <label for="video" title="Search only feeds with embedded videos">Video</label>
                                <input type="checkbox" id="indieweb" /> <label for="indieweb" title="Search only Indieweb feeds">Indieweb</label>
                                <input type="checkbox" id="fediverse" /> <label for="fediverse" title="Search only Fediverse authors">Fediverse</label>
                                <input type="checkbox" id="wordpress" /> <label for="wordpress" title="Search only Wordpress blogs">Wordpress</label>
                                <!--<input type="checkbox" id="blogroll" /> <label for="blogroll" title="Search only feeds with a blogroll">Blogroll</label>-->
                        </div>
                </form>
                <div id="results"></div>
                `;

                const searchInput = el.querySelector('#search');
                searchInput.disabled = false;
                searchInput.focus();
                el.addEventListener('input', this.#performSearch.bind(this));

                this.#results = el.querySelector('#results');
                this.#loadRandom(this.#results);
                this.#results.addEventListener('click', (ev) => {
                        const result = ev.target.closest('.result');
                        if (result) {
                                ev.preventDefault();
                                this.preview(result.querySelector('.resultDetails').dataset.url, result);
                        }
                });
        }

        #performSearch(event) {
                const form = event.target.closest('form');
                const query = form.querySelector('#search').value.toLowerCase();
                const longtext = form.querySelector('#longtext').checked;
                const audio = form.querySelector('#audio').checked;
                const video = form.querySelector('#video').checked;
                const indieweb = form.querySelector('#indieweb').checked;
                const fediverse = form.querySelector('#fediverse').checked;
                const wordpress = form.querySelector('#wordpress').checked;
                const blogroll = false; // form.querySelector('#blogroll').checked;

                console.log(`Searching for ${query}`);

                const list = Object.keys(SubscriberImpl.#index).filter(url => {
                        const value = SubscriberImpl.#index[url];
                        // FIXME: get bits from meta.json
                        if ((indieweb  && !(value.M & 2)) ||
                            (fediverse && !(value.M & 1)) ||
                            (wordpress && !(value.M & 16)) ||
                            (blogroll  && !(value.M & 64)))
                            return false;

                        return value.f.some(feed => {
                                return (url.toLowerCase().includes(query) ||
                                        feed.u.toLowerCase().includes(query) ||
                                        feed.n && feed.n.toLowerCase().includes(query))
                                        && (!longtext || feed.t)
                                        && (!audio || feed.m & 1)
                                        && (!video || feed.m & 2);
                        });
                });

                this.#results.innerHTML = `<h2>Search Results (${list.length})</h2>` +
                        r.renderToString(SubscriberImpl.#template, {
                                results: this.#mapDomainList(list.slice(0, 100))
                        });

                if(query.length > 2) {
                        // Highlight search term in results
                        const r = this.#results.querySelectorAll('.result .highlightText');
                        r.forEach(link => {
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