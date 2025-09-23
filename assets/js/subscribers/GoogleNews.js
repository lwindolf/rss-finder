// vim: set ts=4 sw=4:
import { Subscriber } from "../Subscriber.js";

export class SubscriberImpl extends Subscriber {
    static name = "Google News";
    static favicon = "google-news.png";

    constructor(el) {
        super();

        this.render(el, `
            <div class="block">
                <p>
                    Enter a search query.
                </p>
                <form id="search-form">
                    <input type="text" id="search-input" placeholder="Enter a search term">
                    <button type="submit">Subscribe</button>
                </form>
            </div>
        `, {});

        el.getRootNode().getElementById('search-form').addEventListener('submit', () => {
            let query = el.getRootNode().getElementById('search-input').value.trim();
            this.preview(`https://news.google.com/rss/search?hl=en-US&gl=US&ceid=US%3Aen&oc=11&q=${encodeURIComponent(query)}`);
        });
    }
};
