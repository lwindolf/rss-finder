// vim: set ts=4 sw=4:

// Simple view displaying a concrete subscriber.
// Factory for subscriber implementations.

import * as r from "./helpers/render.js";

export class SubscriberView {
    constructor(el, s) {
        console.log(s);
        r.renderElement(el, r.template(`
            <nav>
                <button>Back to Overview</button>
            </nav>

            <h1><img class="favicon" src="{{settings.icon-path}}/{{favicon}}"></img> {{title}}</h1>

            <div id='subscriberView'>
            </div>
        `), {
            name: s.name,
            favicon: s.favicon,
            title: s.title?s.title:`Find feeds on ${s.name}`,
            settings: window.RssFinder.settings
        });
        new s.class(el.querySelector("#subscriberView"));

        el.querySelector("nav button").addEventListener("click", () => {
            document.dispatchEvent(new CustomEvent('rss-finder-back'));
        });

        document.addEventListener('rss-finder-preview', (ev) => {
            this.#preview(ev.detail);
        });
    }

    #preview(url) {
        /*
        render(this.selector, template(`
            <nav>
                    <a href='#/'>Back to Overview</a>
            </nav>

            <h3>Feed PREVIEW</h3>
            
            {{url}}
        `), {
            url
        });
        */

        // Right now we habe no preview, so we directly subscribe
        console.log(`Launching '${window.RssFinder.settings['scheme']}${url}'`);
        window.open(
            window.RssFinder.settings['scheme']+url,
            window.RssFinder.settings['target']
        );
    }
};
