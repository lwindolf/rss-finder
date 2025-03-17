// vim: set ts=4 sw=4:
import { Subscriber } from "../Subscriber.js";

export class SubscriberImpl extends Subscriber {
    static name = "arXiv";
    static favicon = "arxiv.png";

    constructor(selector) {
        super();

        this.render(selector, `
            <div class="block">
                <p>
                    Enter a category with optional subject code for <a href="https://arxiv.org">arxiv.org</a>. See also <a href="https://info.arxiv.org/help/rss.html">RSS Feeds</a>.
                </p>
                <form id="link-form">
                    <input type="text" id="query-input" placeholder="Category/subject (e.g. 'cs' or 'math.QA')">
                    <button type="submit">Subscribe</button>
                </form>
            </div>
        `, {});

        document.getElementById('link-form').addEventListener('submit', (event) => {
            let query = document.getElementById('query-input').value.trim();
            this.preview(`https://rss.arxiv.org/rss/${query}`);
        });
    }
};
