// vim: set ts=4 sw=4:
import { Subscriber } from "../Subscriber.js";

export class SubscriberImpl extends Subscriber {
        static name = "Search";
        static favicon = "default.svg";
        static title = "Search RSS Feed Index";

        constructor(el) {
                super();

                import("https://lwindolf.github.io/rss-feed-index/RssFeedIndexSearch.js").then(() => {
                        this.render(el, `
                                <div class="block">
                                        <x-rss-feed-index-search
                                                base="https://lwindolf.github.io/rss-feed-index/data/"
                                                style="https://lwindolf.github.io/rss-feed-index/RssFeedIndexSearch.css"
                                        showRandom="0"
                                        stats="0"
                                        title="0">
                                        </x-rss-feed-index-search>
                                </div>
                        `, {});
                });
        }
}