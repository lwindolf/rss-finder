// vim: set ts=4 sw=4:
import { Subscriber } from "../Subscriber.js";

export class SubscriberImpl extends Subscriber {
    static name = "Bing";
    static favicon = "bing.svg";

    constructor(selector) {
        super();

        this.render(selector, `
            <div class="block">
                <p>
                    Bing allows subscribing to search results via RSS.
                </p>
                <form id="search-form">
                    <input type="text" id="search-input" placeholder="Enter query">
                    <button type="submit">Subscribe</button>
                </form>
            </div>
        `, {});

        document.getElementById('link-form').addEventListener('submit', (event) => {
            let search = document.getElementById('search-input').value.trim();
            this.preview(`https://www.bing.com/search?q=${encodeURI(search)}&format=rss`);
        });
    }
};
