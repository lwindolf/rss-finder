// vim: set ts=4 sw=4:
import { Subscriber } from "../Subscriber.js";

export class SubscriberImpl extends Subscriber {
    static name = "RSS-Bridge";
    static favicon = "rss-bridge.png";

    constructor(el) {
        super();

        this.render(el, `
            <div class="block">
                <p>
                    RSS-Bridge is a community driven project that provides RSS feeds for websites that do not have one.
                    Try to look at the "bridges" offered on their public instance: <a href="https://rss-bridge.org/bridge01/">rss-bridge.org/bridge01/</a>
                </p>
            </div>
        `, {});
    }
};
