// vim: set ts=4 sw=4:
import { Subscriber } from "../Subscriber.js";

export class SubscriberImpl extends Subscriber {
    static name = "Google";
    static favicon = "google.webp";

    constructor(el) {
        super();

        this.render(el, `
            <div class="block">
                <p>
                    Google does not allow direct subscribing. But you can create
                    a feed at <a href="https://www.google.com/alerts">Google Alerts</a> and subscribe to it.
                </p>
                <p>
                    To do so open the link and create a new alert.
                    Under Settings select "Deliver to" and choose "RSS feed".
                </p>
            </div>
        `, {});
    }
};
