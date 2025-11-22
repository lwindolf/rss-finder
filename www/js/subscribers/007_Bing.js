// vim: set ts=4 sw=4:
import { Subscriber } from "../Subscriber.js";

export class SubscriberImpl extends Subscriber {
    static name = "Bing";
    static favicon = "bing.svg";
    static title = "Create a Bing search result feed";

    constructor(el) {
        super();

        this.render(el, `
            <div class="block">
                <p>
                    Bing allows subscribing to search results via RSS.
                </p>
                <form id="search-form">
                    <input type="text" id="search-input" placeholder="Enter query">
                    <button type="submit">Preview</button>
                </form>
                <div class="result"></div>
            </div>
        `, {});

        el.getRootNode().getElementById('search-form').addEventListener('submit', (event) => {
            event.preventDefault();

            let search = el.getRootNode().getElementById('search-input').value.trim();
            this.preview(`https://www.bing.com/search?q=${encodeURI(search)}&format=rss`, el.querySelector('.result'));
        });
    }
}