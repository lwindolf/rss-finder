// vim: set ts=4 sw=4:

import { Subscriber } from "../Subscriber.js";

export class SubscriberImpl extends Subscriber {
    static name = "Tumblr";
    static favicon = "tumblr.svg";

    constructor(el) {
        super();

        this.render(el, `
            <h3>Blog Feed</h3>
            <div class="block">
                <form id="user-form">
                    <input type="text" id="user-input" placeholder="Enter blog name">
                    <button type="submit">Subscribe</button>
                </form>
            </div>
        `, {});

        {
            const form  = el.getRootNode().getElementById('user-form');
            const input = el.getRootNode().getElementById('user-input');

            form.addEventListener('submit', (event) => {
                event.preventDefault();
                const username = input.value.trim();
                if (username) {
                    const rssUri = `https://${encodeURIComponent(username)}.tumblr.com/rss`;
                    this.preview(`${rssUri}`);
                }
            });
        }
    }
}