// vim: set ts=4 sw=4:

import { SearchForm } from "../SearchForm.js";

export class SubscriberImpl extends SearchForm {
    static name = "Lemmy";
    static favicon = "lemmy.svg";
    static title = "Find Lemmy community feeds";

    constructor(el) {
        super(
            el,
            (query) =>
                `https://lemmy.ml/api/v3/search?type_=Communities&q=${encodeURIComponent(query)}`,
            (el, data) => {
                console.log(data);
                this.render(el, `
                    {{#each results}}
                        {{#with community}}
                        <div class='result block'>
                            <div class='resultImage'>
                                <img src='{{icon}}'/>
                            </div>
                            <div class='resultDetails'>
                                <div class='resultTitle'><a href="{{actor_id}}">{{name}}</a> -- {{title}}</div>
                                <div class='resultProfile'>{{description}}</div>
                                <div class='resultGenre'></div>
                                <div class='resultFeedHidden'>{{../feed}}</div>
                                <button class='subscribe'>Subscribe</button>
                            </div>
                        </div>
                        {{/with}}
                    {{else}}
                        <p>No results found</p>
                    {{/each}}
                `, {
                    results: data.communities.map(c => {
                        console.log(c);
                        return {
                            ...c,
                            // actor_id is something like https://lemmy.ml/c/Name
                            // we want https://lemmy.ml/feeds/c/Name.xml
                            feed: c.community.actor_id.replace('/c/', '/feeds/c/') + '.xml'
                        };
                    })
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