// vim: set ts=4 sw=4:
import { Subscriber } from "../Subscriber.js";

export class SubscriberImpl extends Subscriber {
    static name = "Patreon";
    static favicon = "patreon.svg";

    constructor(el) {
        super();

        this.render(el, `
            <div class="block">
                <p>
                    Patreon provides audio Podcast RSS feeds for creators, <b>only</b> if the creator has enabled it.                    
                </p>
                <p>
                    To find the RSS feed for a creator:
                    <ol>
                        <li>Go to their Patreon page</li>
                        <li>Look for "<b>Listen in other podcast apps</b>" where you find a link to an authenticated RSS feed
                    matching your subscription.</li>
                    </ol>
                    <b>Note:</b> The copied link already contains your authentication token, so no extra login is needed.
                </p>
            </div>
        `, {});
    }
}
