// vim: set ts=4 sw=4:

import { FeedUpdater } from "../feedupdater.js";
import * as r from "../helpers/render.js";

// fetch and render a feed

export class FeedView {
    // state
    #el;
    #feed;

    constructor(el, url) {
        this.#el = el;
        r.renderElement(el, r.template(`
            <div class="previewContainer">Fetching feed&nbsp;<a href="{{url}}" target="_blank">{{url}}</a>...</div>
        `), {
            url
        });
        this.#render(el, url);
    }

    async #render(el, url) {
        this.#feed = await FeedUpdater.fetch(url, true);

        if (this.#feed.newItems) {
            this.#feed.newItems = this.#feed.newItems.slice(0, 100); // limit preview to 100 items
            this.#feed.newItems.forEach(item => {
                item.date = new Date(item.time * 1000).toLocaleString();

                // Fix missing title (provide result in item.title2)
                if (!item.title || item.title.trim().length === 0)
                    if (item.description && item.description.length > 0) {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(item.description, 'text/html');
                        const textContent = doc.body.textContent || '';
                        item.title2 = textContent.substring(0, 100) + (textContent.length > 100 ? '...' : '');
                    } else {
                        item.title2 = 'No title';
                    }
                else
                    item.title2 = item.title;
            });
        }

        r.renderElement(el, r.template(`
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
                        </div>
                        <div class="itemview">
                        </div>
                    </div>
            {{/compare}}
        `), {
            feed: this.#feed,
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
}