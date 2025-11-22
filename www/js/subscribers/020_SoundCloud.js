// vim: set ts=4 sw=4:
import { Subscriber } from "../Subscriber.js";

export class SubscriberImpl extends Subscriber {
    static name = "SoundCloud";
    static favicon = "soundcloud.png";

    constructor(el) {
        super();

        this.render(el, `
            <div class="block">
                <p>
                    To find the RSS feed for a creator:
                    <ol>
                        <li>Go to their artist page on SoundCloud</li>
                        <li>View the HTML source of the page and search for <tt>soundcloud://users:XXXXXXX</tt></li>
                        <li>Now build URL with the correct id <tt>https://feeds.soundcloud.com/users/soundcloud:users:XXXXXXX/sounds.rss</tt></li>
                    </ol>
                </p>
            </div>
        `, {});
    }
}