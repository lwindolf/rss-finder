// vim: set ts=4 sw=4:
import { Subscriber } from "../Subscriber.js";

export class SubscriberImpl extends Subscriber {
    static name = "Newsletter";
    static favicon = "default.svg";

    constructor(el) {
        super();

        this.render(el, `
            <div class="block">
                <p>
                    The free web service <a href="https://kill-the-newsletter.com/">Kill the Newsletter</a> allows you to subscribe to newsletters.
                    It creates a temporary email address for you that you can use to subscribe to a newsletter.
                    Finally it provides you with an RSS feed that you can use to read the inbox of this email adress.
                </p>
            </div>
        `, {});
    }
}
