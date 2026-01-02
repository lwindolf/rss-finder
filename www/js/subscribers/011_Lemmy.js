// vim: set ts=4 sw=4:

import { SearchForm } from "../SearchForm.js";

export class SubscriberImpl extends SearchForm {
    static name = "Lemmy";
    static favicon = "lemmy.svg";
    static title = "Find Lemmy community feeds";

    constructor(el) {
        super(
            el,
            (params) =>
                `https://lemmy.ml/api/v3/search?type_=Communities&q=${encodeURIComponent(params.search)}`,
            (el, data) => {
                this.render(el, `
                    {{#each results}}
                        {{#with community}}
                        <div class='result block'>
                            <div class='resultImage'>
                                <img src='{{icon}}' loading='lazy'/>
                            </div>
                            <div class='resultDetails'>
                                <div class='resultTitle'><a href="{{actor_id}}">{{name}}</a> -- {{title}}</div>
                                <div class='resultProfile'>{{description}}</div>
                                <div class='resultGenre'></div>
                                <div class='resultFeedHidden'>{{../feed}}</div>
                            </div>
                        </div>
                        {{/with}}
                    {{else}}
                        <p>No results found</p>
                    {{/each}}
                `, {
                    results: data.communities.map(c => {
                        return {
                            ...c,
                            // actor_id is something like https://lemmy.ml/c/Name
                            // we want https://lemmy.ml/feeds/c/Name.xml
                            feed: c.community.actor_id.replace('/c/', '/feeds/c/') + '.xml'
                        };
                    })
                });

                el.getRootNode().querySelectorAll('.result').forEach((details) => {
                    details.addEventListener('click', (ev) => {
                        ev.preventDefault();
                        this.preview(details.querySelector('.resultFeedHidden').textContent, details);
                    });
                });
            }
        );
    }
}
