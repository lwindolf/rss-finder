// vim: set ts=4 sw=4:

// Simple view displaying a concrete subscriber.
// A factory for subscriber classes.

import { render, template } from "./helpers/render.js";

export class SubscriberView {
    selector;

    constructor(selector, s) {
        this.selector = selector;
        render(this.selector, template(`
            <nav>
                    <a href='#/'>Go Back</a>
            </nav>

            <h1><img class="favicon" src="{{favicon}}"></img> Find feeds on {{name}}</h1>

            <div id='subscriberView'>
            </div>
        `), {
            name: s.name,
            favicon: s.favicon
        });
        new s.class("#subscriberView");

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
        window.open('feed:'+url, '_blank');
    }
};