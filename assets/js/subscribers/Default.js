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

            fetch(feedUrl)
                .then(response => response.text())
                .then(data => this.autodiscover(el, data, feedUrl))
                .catch(error => this.#corsError(el, feedUrl));            
        });
    }

    #corsError(el, feedUrl) {
        this.render(el.getRootNode().getElementById('results'), `
            <div class="block">
                <p>
                    Failed to fetch feed from <a href="{{feedUrl}}">{{feedUrl}}</a>. Please check if you can reach
                    the website directly in your browser.
                    
                </p>
                <p>
                    If you can reach the website manually this is likely due to a <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS">CORS</a> policy.
                    While CORS is a security feature important in many web use cases it is actually hindering valid feed discovery use cases. 
                    To work around this issue you can use a CORS proxy.
                </p>
                <p>
                    <b>Note: the proxy owner <a href="https://corsproxy.io/">Cloudflare</a> will see your request!</b>
                </p>
                <form id="cors-retry-form">
                    <input type="text" id="proxyUrl" placeholder="Enter a CORS proxy URL" value="{{proxyUrl}}">
                    <button type="submit">Try again using CORS proxy</button>
                </form>
            </div>
        `, {
            feedUrl,
            proxyUrl : 'https://corsproxy.io/?url=' + encodeURI(feedUrl)
        });

        const form = el.getRootNode().getElementById('cors-retry-form');
        const url  = el.getRootNode().getElementById('proxyUrl');

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const proxyUrl = url.value.trim();
            fetch(proxyUrl)
                .then(response => response.text())
                .then(data => this.autodiscover(el, data, proxyUrl))
                .catch(error => console.error(error));            
        });
    }
};
