// vim: set ts=4 sw=4:
import { Subscriber } from "../Subscriber.js";

export class SubscriberImpl extends Subscriber {
    static name = "Website";
    static favicon = "default.svg";

    constructor(el) {
        super();

        this.render(el, `
            <div class="block">
                    <p>
                            Discover feeds on any website by parsing the HTML.
                    </p>
                    <form id="url-form">
                            <input type="text" id="url" name="url" placeholder="Website URL" required>
                            <button type="submit">Check for feeds</button>
                    </form>
            </div>

            <div id="results"></div>
         `, {});

        const form    = el.getRootNode().getElementById('url-form');
        const url     = el.getRootNode().getElementById('url');

        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            let feedUrl = url.value.trim();

            if (!feedUrl.startsWith('http'))
                feedUrl = `https://${feedUrl}`;

            let response = await fetch(feedUrl, { corsProxyAllowed: true });
            if (response && response.ok) {
                let data = await response.text();
                this.autodiscover(el, data, feedUrl);
            } else {
                el.querySelector("#results").innerHTML = `<p class="error">Failed to fetch <a href="${feedUrl}">${feedUrl}</a>: ${response ? response.status : ''} ${response ? response.statusText : ''}</p>`;
            }
        });
    }
}