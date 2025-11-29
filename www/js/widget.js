// vim: set ts=4 sw=4:

import { SubscriberOverview } from "./SubscriberOverview.js";

// Implements <x-rss-finder> web component

const stylesheet = new CSSStyleSheet()

stylesheet.replaceSync(`
.block {
        background: #eee;
        padding: 16px;
        border-radius: 6px;
        margin: 0 12px 12px 0;
}

.subscriberList {
        display: flex;
        flex-wrap: wrap;
}

h1 img.favicon {
        width: 24px;
        height: auto;
        vertical-align: baseline;
}

.subscriber {
        width: 80px;
        height: 110px;
}

.subscriber:hover {
        background: #ddd;
}

#subscriberView form input {
        box-sizing: border-box;
        width: 100%;
        margin-bottom: 12px;
        padding: 6px;
}

#subscriberView form button {
        padding: 6px;
}

.subscriberList a {
        text-decoration: none;
        color: #666;
}

.subscriber img {
        width: 80px;
        height: 80px;
        object-fit: cover;
}

.subscriberTitle {
        width: auto;
        text-align: center;
        font-weight: bold;
        padding: 12px 0;
}

.result {
        margin-bottom: 12px;
        cursor: pointer;
}
.result:hover {
        background: #ddd;
}

.result button {
        padding: 0.5rem;
}
.result button img {
        width: 1rem;
        height: auto;
        vertical-align: middle;
        margin-right: 0.5rem;
}

.resultInfo {
        display: flex;
        align-items: top;
}

.resultImage img {
        width: 100px;
        height: auto;
        margin-right: 12px;
        border-radius: 6px;
}

.resultDetails {
        flex: 1;
}

.resultDetails * a {
        text-decoration: none;
        color: #444;
}
.resultDetails * a:hover {
        text-decoration: underline;
}

.resultDetails div {
        margin-bottom: 6px;
}

.resultTitle {
        font-weight: bold;
        text-decoration: none;
}

.resultAuthor {
        text-decoration: none
}

.resultFeedHidden {
        display: none;
}

.resultGenre span {
        display: inline-block;
        border-radius: 3px;
        background: #ddd;
        border: 1px solid #ccc;
        padding: 3px 6px;
        font-size: 80%;
}

.previewContainer {
        display: flex;
        flex-grow: 1;
        gap: 0;
        width: 100%;
        height:50vh;
        background: white;
        clear: both;
        margin-bottom: 0.5rem;
        margin-top: 0.5rem;
        color: #222;
}
.itemlist {
        flex: 1;
        margin:0;
        border: 1px solid #777;
        cursor: pointer;
        overflow: hidden;
        overflow-y: scroll;
}

.itemlist .item {
        border-bottom: 1px solid #aaa;
        padding: 0.8rem 0.5rem;
}
.itemlist .item:last-child {
        border: none;
}
.itemlist .item:hover {
        background: #ddd;
}
.itemlist .item .title {
        font-weight: bold;
}
.itemlist .item.selected {
        background: #ddd;
}
.itemlist .item .date,
.itemview .date {
        font-size: 80%;
        color: #666;
}

.itemview {
        cursor: default;
        flex: 1;
        margin:0;
        padding: 1rem;
        vertical-align: top;
        overflow: hidden;
        overflow-y: scroll;
        border: 1px solid #777;
}
.itemview .title a {
        text-decoration: none;
        color: #222;
}
.itemview .content {
        margin-top: 1rem;
}
.itemview .content img {
        max-width: 100%;
        height: auto;
}
.itemview .content audio {
        width: 100%;
}
.itemview .content video {
        max-width: 100%;
        height: auto;
}

.highlight {
        background: yellow;
}
`);

class RssFinder extends HTMLElement {
        // state
        #subscribers = {};      // available subscribers
        settings = {
                // Note: we treat all settings as strings
                "show-title"        : "true",
                "scheme"            : "feed:",
                "use-cors-proxy"    : "false",
                "cors-proxy"        : "https://corsproxy.io/?url=",
                "icon-path"         : "icons",
                "launch-with-fetch" : "false"
        };

        constructor() {
                super();
                window.RssFinder = this;
        }

        connectedCallback() {
                this.attachShadow({ mode: "open" }).adoptedStyleSheets = [stylesheet];

                // Collect parameters from shadow root attributes
                const tagSettings = [...this.shadowRoot.host.attributes].reduce((acc, attribute) => {
                        acc[attribute.nodeName] = attribute.nodeValue;
                        return acc;
                }, {});
                Object.assign(this.settings, tagSettings);

                // Collect parameters from URL query string
                const queryParams = new URLSearchParams(window.location.search);
                for(const [key, value] of queryParams.entries()) {
                        if (key in this.settings)
                                this.settings[key] = value;
                }

                this.content = document.createElement('div');
                this.shadowRoot.appendChild(this.content);
                new SubscriberOverview(this.content);
        }
}

customElements.define('x-rss-finder', RssFinder);

