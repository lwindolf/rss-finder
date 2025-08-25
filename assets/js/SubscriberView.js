// vim: set ts=4 sw=4:

// Simple view displaying a concrete subscriber.
// Factory for subscriber implementations.

import * as r from "./helpers/render.js";

export class SubscriberView {
    constructor(el, s) {
        r.renderElement(el, r.template(`
            <nav>
                <a href='' name='go-back'>Go Back</a>
            </nav>

            <h1><img class="favicon" src="assets/icons/{{favicon}}"></img> Find feeds on {{name}}</h1>

            <div id='subscriberView'>
            </div>
        `), {
            name: s.name,
            favicon: s.favicon
        });
        new s.class(el.querySelector("#subscriberView"));

        document.addEventListener('preview', (ev) => {
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
        window.open(
            window.RssFinder.settings['scheme']+url,
            window.RssFinder.settings['target']
        );
    }
};
