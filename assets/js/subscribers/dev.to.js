// vim: set ts=4 sw=4:

import { Subscriber } from "../Subscriber.js";

// https://dev.to/kallmanation/dev-to-writing-rss-j0o

export class SubscriberImpl extends Subscriber {
    static name = "dev.to";
    static favicon = "dev.to.png";

    constructor(el) {
        super();

        this.render(el, `
            <h3>Tag Feed</h3>
            <div class="block">
                <form id="search-form">
                    <input type="text" id="search-input" placeholder="Enter tag name">
                    <button type="submit">Subscribe</button>
                </form>
            </div>

            <h3>User Feed</h3>
            <div class="block">
                <form id="user-form">
                    <input type="text" id="user-input" placeholder="Enter artist username">
                    <button type="submit">Subscribe</button>
                </form>
            </div>
        `, {});

        {
            const form  = el.getRootNode().getElementById('search-form');
            const input = el.getRootNode().getElementById('search-input');

            form.addEventListener('submit', (event) => {
                event.preventDefault();
                const searchTerm = input.value.trim();
                if (searchTerm) {
                    const rssUri = `https://dev.to/feed/tag/${encodeURIComponent(searchTerm)}`;
                    this.preview(`${rssUri}`);
                }
            });
        }
        {
            const form  = el.getRootNode().getElementById('user-form');
            const input = el.getRootNode().getElementById('user-input');

            form.addEventListener('submit', (event) => {
                event.preventDefault();
                const username = input.value.trim();
                if (username) {
                    const rssUri = `https://dev.to/feed/${encodeURIComponent(username)}`;
                    this.preview(`${rssUri}`);
                }
            });
        }
    }
}