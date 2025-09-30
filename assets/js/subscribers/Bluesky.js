// vim: set ts=4 sw=4:

import { SearchForm } from "../SearchForm.js";

export class SubscriberImpl extends SearchForm {
    static name = "Bluesky";
    static favicon = "bluesky.png";

    constructor(el) {
        super(
            el,
            (query) =>
                `https://public.api.bsky.app/xrpc/app.bsky.actor.searchActors?q=${encodeURIComponent(query)}`,
            (el, data) => {
                this.render(el, `            
                    {{#each results}}
                        <div class='result block'>
                            <div class='resultImage'>
                                <img src='{{avatar}}' loading='lazy'/>
                            </div>
                            <div class='resultDetails'>
                                <div class='resultTitle'><a href="https://bsky.app/profile/{{handle}}">{{displayName}}</a> -- @{{handle}}</div>
                                <div class='resultProfile'>{{description}}</div>
                                <div class='resultFeedHidden'>https://bsky.app/profile/{{handle}}</div>
                                <button class='subscribe'>Subscribe</button>
                            </div>
                        </div>
                    {{else}}
                        <p>No results found</p>
                    {{/each}}
                `, {
                    results: data.actors
                });

                el.getRootNode().querySelectorAll('.resultDetails button.subscribe').forEach((button) => {
                    button.addEventListener('click', (ev) => {
                        const result = ev.target.closest('.result');
                        this.preview(result.querySelector('.resultFeedHidden').textContent);
                    });
                });
            }
        );
    }
}
