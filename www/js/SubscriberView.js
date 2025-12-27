// vim: set ts=4 sw=4:

// Simple view displaying a concrete subscriber.
// Factory for subscriber implementations.

import { FeedUpdater } from "./feedupdater.js";
import { SubscriberList } from "./SubscriberList.js";
import * as r from "./helpers/render.js";

export class SubscriberView {
    // state
    #el;
    #feed;

    constructor(el, name) {
        this.#el = el;

        const module = SubscriberList.getByName(name).module;
        import(`./subscribers/${module}`).then((m) => {
            const s = m.SubscriberImpl;

            r.renderElement(el, r.template(`
                <nav>
                    <button>Back to Overview</button>
                </nav>

                <h1><img class="favicon" src="{{settings.icon-path}}/{{favicon}}"></img> {{title}}</h1>

                <div id='subscriberView'>
                </div>
            `), {
                name: s.name,
                favicon: s.favicon,
                title: s.title?s.title:`Find feeds on ${s.name}`,
                settings: window.RssFinder.settings
            });
            new s(el.querySelector("#subscriberView"));

            el.querySelector("nav button").addEventListener("click", () => {
                document.dispatchEvent(new CustomEvent('rss-finder-back'));
            });

            document.addEventListener('rss-finder-preview', (ev) => {
                this.#preview(ev.detail.url, ev.detail.el);
            });
        });
    }

    // Provide a preview of the feed at the given URL rendered into the given element
    // Any preview preview will be closed
    async #preview(url, el) {
        el.parentNode.querySelectorAll(".preview").forEach(e => e.remove());
        const preview = document.createElement("div");
        el.appendChild(preview).className = "preview";
        r.renderElement(preview, r.template(`            
            <div class="previewContainer">Fetching feed&nbsp;<a href="{{url}}" target="_blank">{{url}}</a>...</div>
        `), {
            url
        });

        // first try without CORS proxy
        this.#feed = await FeedUpdater.fetch(url, false);

        // then with CORS proxy
        if(this.#feed.error > 0)
            this.#feed = await FeedUpdater.fetch(url, true);

        if (this.#feed.newItems) {
            this.#feed.newItems = this.#feed.newItems.slice(0, 100); // limit preview to 100 items
            this.#feed.newItems.forEach(item => {
                item.date = new Date(item.time*1000).toLocaleString();

                // Fix missing title (provide result in item.title2)
                if (!item.title || item.title.trim().length === 0)
                    if (item.description && item.description.length > 0) {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(item.description, 'text/html');
                        const textContent = doc.body.textContent || '';
                        item.title2 = textContent.substring(0, 100) + (textContent.length > 100 ? '...' : '');
                        console.log("Fixed item title", item.title);
                    } else {
                        item.title2 = 'No title';
                    }
                else
                    item.title2 = item.title;
            });
        }

        r.renderElement(preview, r.template(`
            {{#compare feed.error '!=' 0}}
                <p class="error">Failed to load feed (error code {{feed.error}})</p>
            {{else}}                
                <div class="previewContainer">
                    <div class="itemlist">
                        {{#each feed.newItems}}
                            <div class="item" data-idx="{{@index}}">
                                <div class="title">{{title2}}</div>
                                <div class="date">{{date}}</div>
                            </div>
                        {{else}}
                            <p>No items found in this feed.</p>
                        {{/each}}
                    </div><div class="itemview">

                    </div>
                </div>
                <button id="subscribeButton"><img src="icons/default.svg"/> Subscribe</button> <button id="copyUrlButton">📋 Copy Feed URL</button>
            {{/compare}}
        `), {
            feed: this.#feed
        });
        this.#renderItem(el, 0);

        el.querySelector(".previewContainer").addEventListener("click", (ev) => {
            ev.stopPropagation();
        });
        el.querySelectorAll(".itemlist .item").forEach((item, idx) => {
            item.addEventListener("click", () => {
                this.#renderItem(el, idx);
            });
        });
        el.querySelector("#subscribeButton").addEventListener("click", (ev) => {
            ev.stopPropagation();
            this.#launch(url);
        });
        el.querySelector("#copyUrlButton").addEventListener("click", (ev) => {
            ev.stopPropagation();
            navigator.clipboard.writeText(url).then(() => {
                const btn = el.querySelector("#copyUrlButton");
                const oldText = btn.textContent;
                btn.textContent = "Copied!";
                setTimeout(() => {
                    btn.textContent = oldText;
                }, 2000);
            });
        });
    }

    #renderItem(el, idx) {
        const item = this.#feed.newItems[idx];
        if(!item)
            return;

        /* Set title for it to appear in e.g. desktop MPRIS playback controls */
        if(item.title)
            document.title = item.title;

        el.querySelectorAll(`.itemlist .item.selected`).forEach(e => e.classList.remove("selected"));
        el.querySelector(`.itemlist .item[data-idx='${idx}']`).classList.add("selected");

        r.renderElement(el.querySelector(".itemview"), r.template(`
            <h2 class="title">
                {{#if item.title}}
                    <a target='_system' href='{{item.source}}'>{{item.title}}</a>
                {{else}}
                    <a target='_system' class='missingTitle' href='{{item.source}}'>Link to post</a>
                {{/if}}
            </h2>
            <div class="date">{{item.date}}</div>
            <div class="content">
                <div class="media">
                    {{#each item.media}}
                    <p>
                        {{#compare this.mime 'startsWith' 'audio'}}
                            <audio controls src='{{this.url}}'></audio>
                        {{/compare}}
                        {{#compare this.mime 'startsWith' 'video'}}
                            <video controls src='{{this.url}}'></video>
                        {{/compare}}
                    </p>
                    {{/each}}
                </div>
                {{{item.description}}}
            </div>
        `), {
            item
        });

        el.querySelector(".itemview").scrollTop = 0;
    }

    #launch(url) {
        const method = window.RssFinder.settings['launch-method'];

        console.log(`Launching URL '${url}' with method '${method}'`);

        if(method === 'fetch') {
            console.log(`Fetch using schema URL '${window.RssFinder.settings['scheme']}${url}'`);
            fetch(window.RssFinder.settings['scheme']+url).catch((e) => {
                console.warn("Failed to launch via fetch:", e);
            });
            return;
        }

        if(method === 'location') {
            // Custom URI scheme launching via location is somewhat complicated
            //
            // - Firefox (without default "No ask" handler): OK shows a dialog, does not open the link
            // - Firefox (with default "No ask" handler): blank page
            // - Chrome/Webkit: blank page
            //
            // To avoid blank pages we reopen the original link with a timeout.
            // (https://stackoverflow.com/questions/24779312/simplest-cross-browser-check-if-protocol-handler-is-registered)

            const oldLocation = window.location;
            setTimeout(function() {
                // Do not overwrite needlessly (so current subscriber page stays visible)
                if(window.location !== oldLocation)
                    window.location = oldLocation;
            }, 200);

            window.open(window.RssFinder.settings['scheme']+url, '_self');
            return;
        }

        if(method === 'event') {
            document.dispatchEvent(new CustomEvent('rss-finder-subscribe', {
                detail: { url }
            }));
            return;
        }

        console.error("Unsupported launch method:", method);
    }
}