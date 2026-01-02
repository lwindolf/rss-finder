// vim: set ts=4 sw=4:

import { Fediverse } from "../Fediverse.js";
import { SearchForm } from "../SearchForm.js";

export class SubscriberImpl extends SearchForm {
    static name = "FunkWhale";
    static favicon = "funkwhale.ico";
    static title = "Find FunkWhale channels";
    static category = "audio";

    constructor(el) {
        super(
            el,
            (params) =>
                `https://${params.server}/api/v1/channels/`,
            (el, data) => {
                this.render(el, `
                    {{#each results}}
                        <div class='result block'>
                            <div class='resultInfo'>
                                <div class='resultImage'>
                                    <img src='{{artist.cover.urls.medium_square_crop}}' loading='lazy'/>
                                </div>
                                <div class='resultDetails'>
                                    <div class='resultTitle'>
                                        <a href="{{artist.fid}}">{{artist.name}}</a>
                                    </div>
                                    <div class='resultProfile'>
                                        <p>
                                            {{#if artist.tracks_count}}
                                                Track count: {{artist.tracks_count}}
                                            {{/if}}
                                        </p>
                                        <p>{{{artist.description.html}}}</p>
                                    </div>
                                    <div class='resultGenre'>
                                        {{#each artist.tags}}
                                            <span>{{this}}</span>
                                        {{/each}}
                                    </div>
                                    <div class='resultFeedHidden'>{{rss_url}}</div>
                                </div>
                            </div>
                        </div>
                    {{else}}
                        <p>No results found</p>
                    {{/each}}
                `, {
                    results: data.results
                });

                el.getRootNode().querySelectorAll('.result').forEach((details) => {
                    details.addEventListener('click', (ev) => {
                        ev.preventDefault();
                        this.preview(details.querySelector('.resultFeedHidden').textContent, details);
                    });
                });
            },
            [
                {
                    name: "server",
                    type: "select",
                    options: Fediverse.getNodesBySW('funkwhale')
                    .sort((a, b) => a.domain.localeCompare(b.domain))
                    .map(node => ({
                        value: node.domain,
                        label: node.domain + (node.name ? ' --- ' + node.name : '')
                    })),
                    label: "<p>Select a FunkWhale instance to show all artist accounts</p>"
                }
            ]
        );
    }
}
