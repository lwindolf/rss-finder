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
        display: flex;
        align-items: top;
        margin-bottom: 12px;
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
`);

class RssFinder extends HTMLElement {
        // state
        #subscribers = {};      // available subscribers
        settings = {
                // Note: we treat all settings as strings
                "show-title"     : "false",
                "scheme"         : "feed:",
                "use-cors-proxy" : "false",
                "cors-proxy"     : "https://corsproxy.io/?url=",
                "target"         : "_blank"
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
                        this.settings[key] = value;
                }

                this.content = document.createElement('div');
                this.shadowRoot.appendChild(this.content);
                this.loadOverview();
        }

        async loadOverview() {
                this.#subscribers = {};

                // FIXME: generate JSON list using build.sh
                for(const routeName of [
                        'Search',
                        'Default',
                        'killthenewsletter',
                        'arxiv.org',
                        'Archive.org',
                        'Google',
                        'Bing',
                        'iTunes',
                        'Mastodon',
                        'Reddit',
                        'YouTube'
                ]) {
                        try {
                                const s = await import(`./subscribers/${routeName}.js`);
                                this.#subscribers[routeName] = {
                                        name      : s.SubscriberImpl.name,
                                        favicon   : s.SubscriberImpl.favicon,
                                        title     : s.SubscriberImpl.title,
                                        class     : s.SubscriberImpl,
                                        routeName
                                }
                        } catch(e) {
                                console.error(`Failed to load subscriber ${routeName}: ${e}`);
                        }
                }                
                new SubscriberOverview(this.content, this.#subscribers);
        }
}

customElements.define('x-rss-finder', RssFinder);

