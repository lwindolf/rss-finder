// vim: set ts=4 sw=4:
import { Subscriber } from "../Subscriber.js";

export class SubscriberImpl extends Subscriber {
        static name = "From URL";
        static favicon = "icons/default.svg";

        constructor(selector) {
                super();

                this.render(selector, `FIXME: implement me!`, {});
        }
};