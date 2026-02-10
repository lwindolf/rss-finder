// vim: set ts=4 sw=4:

import { SearchForm } from "../SearchForm.js";

export class SubscriberImpl extends SearchForm {
    static name = "Mastodon";
    static favicon = "mastodon.png";
    static title = "Find Mastodon accounts";

    constructor(el) {
        super(
            el,
            (params) =>
                `https://mastodon.social/api/v2/search?type=accounts&q=${encodeURIComponent(params.search)}`,
            (el, data) => {
                this.render(el, `
                    {{#each results}}
                        <div class='result block'>
                            <div class='resultInfo'>
                                <div class='resultImage'>
                                    <img src='{{avatar}}' loading='lazy'/>
                                </div>
                                <div class='resultDetails'>
                                    <div class='resultTitle'><a href="{{url}}">{{acct}}</a> -- {{display_name}}</div>
                                    <div class='resultProfile'>{{{note}}}</div>
                                    <div class='resultGenre'></div>
                                    <div class='resultFeedHidden'>{{url}}.rss</div>
                                </div>
                            </div>
                        </div>
                    {{else}}
                        <p>No results found</p>
                    {{/each}}
                `, {
                    results: data.accounts
                });

                el.getRootNode().querySelectorAll('.result').forEach((details) => {
                    details.addEventListener('click', (ev) => {
                        ev.preventDefault();
                        this.preview(details.querySelector('.resultFeedHidden').textContent, details);
                    });
                });
            }
        );

        el.getRootNode().getElementById('results').innerHTML += `
            <p>
                Hint: Mastodon RSS feeds are created by adding ".rss" to the end of the URL of Mastodon page links.
            </p>
            `;
    }
}
