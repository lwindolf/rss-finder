//https://news.google.com/rss/search?hl=en-US&gl=US&ceid=US%3Aen&oc=11&q=technology%20news

// vim: set ts=4 sw=4:
import { Subscriber } from "../Subscriber.js";

export class SubscriberImpl extends Subscriber {
    static name = "Google News";
    static favicon = "google-news.png";

    constructor(selector) {
        super();

        this.render(selector, `
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

        document.getElementById('search-form').addEventListener('submit', (event) => {
            let query = document.getElementById('search-input').value.trim();
            this.preview(`https://news.google.com/rss/search?hl=en-US&gl=US&ceid=US%3Aen&oc=11&q=${encodeURIComponent(query)}`);
        });
    }
};
