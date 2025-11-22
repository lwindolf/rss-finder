// vim: set ts=4 sw=4:
import { Subscriber } from "../Subscriber.js";

export class SubscriberImpl extends Subscriber {
    static name = "Reddit";
    static favicon = "reddit.png";

    constructor(el) {
        super();

        this.render(el, `
            <h3>Feed for subreddit</h3>
            <div class="block">
                <form id="subreddit-form">
                    <input type="text" id="subreddit-input" placeholder="Enter subreddit name">
                    <button type="submit">Preview</button>
                    <div class="result"></div>
                </form>
            </div>

            <h3>Feed for a user</h3>
            <div class="block">
                <form id="reddit-user-form">
                    <input type="text" id="reddit-user-input" placeholder="Enter Reddit username">
                    <button type="submit">Preview</button>
                    <div class="result"></div>
                </form>
            </div>
        `, {});

        {
            const form  = el.getRootNode().getElementById('subreddit-form');
            const input = el.getRootNode().getElementById('subreddit-input');

            form.addEventListener('submit', (event) => {
                event.preventDefault();
                const subreddit = input.value.trim();
                if (subreddit) {
                    const rssUri = `https://www.reddit.com/r/${subreddit}/.rss`;
                    console.log("RSS URI: ", rssUri);
                    this.preview(`${rssUri}`, form.querySelector(".result"));
                }
            });
        }
        {
            const form  = el.getRootNode().getElementById('reddit-user-form');
            const input = el.getRootNode().getElementById('reddit-user-input');

            form.addEventListener('submit', (event) => {
                event.preventDefault();
                const username = input.value.trim();
                if (username) {
                    const rssUri = `https://www.reddit.com/user/${username}/.rss`;

                    this.preview(`${rssUri}`, form.querySelector(".result"));
                }
            });
        }
    }
}