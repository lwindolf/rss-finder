// vim: set ts=4 sw=4:
import { Subscriber } from "../Subscriber.js";

export class SubscriberImpl extends Subscriber {
    static name = "Friendi.ca";
    static favicon = "friendica.png";
    static title = "Find Friendica accounts";

    constructor(el) {
        super();

        this.render(el, `
            <div class="block">
                <p>
                    Due to it's distributed nature Friendi.ca cannot be easily searched.
                </p>
                <p>
                    If you want to search all Friendi.ca pods for accounts you can use the 
                    <a href="https://dir.friendica.social/">dir.friendica.social</a> directory.
                </p>
            </div>
        `, {});
    }
}
