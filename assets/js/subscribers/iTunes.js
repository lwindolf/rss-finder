// vim: set ts=4 sw=4:

import { SearchForm } from "../SearchForm.js";

export class SubscriberImpl extends SearchForm {
    static name = "iTunes";
    static favicon = "itunes.svg";

    constructor(el) {
        super(
            el,
            (query) =>
                `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=podcast&entity=podcast&limit=20&version=2&output=json`,
            (el, data) => {
                this.render(el, `            
                    {{#each results}}
                        <div class='result block'>
                            <div class='resultImage'>
                                <img src='{{artworkUrl100}}'/>
                            </div>
                            <div class='resultDetails'>
                                <div class='resultTitle'><a href="{{collectionViewUrl}}">{{collectionName}}</a></div>
                                <div class='resultArtist'>{{artistName}}</div>
                                <div class='resultGenre'>
                                    {{#each genres}}
                                        <span>{{this}}</span>
                                    {{/each}}
                                </div>
                                <div class='resultFeedHidden'>{{feedUrl}}</div>
                                <button class='subscribe'>Subscribe</button>
                            </div>
                        </div>
                    {{else}}
                        <p>No results found</p>
                    {{/each}}
                `, {
                    results: data.results
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
