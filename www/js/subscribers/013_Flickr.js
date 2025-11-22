// vim: set ts=4 sw=4:

import { Subscriber } from "../Subscriber.js";

// Feeds API doc https://www.flickr.com/services/feeds/docs/photos_friends/

export class SubscriberImpl extends Subscriber {
    static name = "Flickr";
    static favicon = "flickr.ico";

    constructor(el) {
        super();

        this.render(el, `
            <h3>User Feed</h3>
            <div class="block">
                <form id="user-form">
                    <input type="text" id="user-input" placeholder="Enter artist username">
                    <button type="submit">Preview</button>
                    <div class="result"></div>
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
                    const rssUri = `https://www.flickr.com/services/feeds/photos_public.gne?user_id=${encodeURIComponent(username)}`;
                    this.preview(`${rssUri}`, event.target.querySelector('.result'));
                }
            });
        }
    }
}