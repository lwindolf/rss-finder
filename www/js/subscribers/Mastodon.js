// vim: set ts=4 sw=4:
import { Subscriber } from "../Subscriber.js";

export class SubscriberImpl extends Subscriber {
    static name = "Mastodon";
    static favicon = "icons/mastodon.png";

    constructor(selector) {
        super();

        this.render(selector, `
            <div class="block">
                <p>
                    Hint: Mastodon RSS feeds are created by adding ".rss" to the end of the URL.
                </p>
                <p>
                    Enter link to any Mastodon page.
                </p>
                <form id="link-form">
                    <input type="text" id="link-input" placeholder="Enter Mastodon page link">
                    <button type="submit">Subscribe</button>
                </form>
            </div>
        `, {});

        document.getElementById('link-form').addEventListener('submit', (event) => {
            let url = document.getElementById('link-input').value.trim();
            if (-1 == url.indexOf('://'))
                url = `https://${url}`;
            this.preview(`${url}.rss`);
        });
    }
};
