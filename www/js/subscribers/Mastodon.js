// vim: set ts=4 sw=4:
import { Subscriber } from "../Subscriber.js";

export class SubscriberImpl extends Subscriber {
    static name = "Mastodon";
    static favicon = "icons/mastodon.png";

    constructor(selector) {
        super();

        this.render(selector, `
            <p>Enter link to user page</p>
            <form id="link-form">
                <input type="text" id="link-input" placeholder="Enter user page link">
                <button type="submit">Subscribe</button>
            </form>
        `, {});

        const form = document.getElementById('link-form');
        const input = document.getElementById('link-input');

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const user = input.value.trim();
            if (user) {
                const rssUri = `https://www.reddit.com/r/${user}/.rss`;
                console.log(`RSS URI: ${rssUri}`);
            }
        });
    }
};
