// vim: set ts=4 sw=4:

import { Subscriber } from "../Subscriber.js";

export class SubscriberImpl extends Subscriber {
    static name = "DeviantArt";
    static favicon = "deviantart.png";

    constructor(el) {
        super();

        this.render(el, `
            <h3>Search Feed</h3>
            <div class="block">
                <form id="search-form">
                    <input type="text" id="search-input" placeholder="Enter search term">
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
                    const rssUri = `https://backend.deviantart.com/rss.xml?type=deviation&q=boost%3Apopular+in%3Adigitalart%2Fdrawings+${encodeURIComponent(searchTerm)}`;
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
                    const rssUri = `https://backend.deviantart.com/rss.xml?type=deviation&q=by%3A${encodeURIComponent(username)}+sort%3Atime+meta%3Aall`;
                    this.preview(`${rssUri}`);
                }
            });
        }
    }
}