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
                    <a href='#/'>Back to Overview</a>
            </nav>

            <h1>Subscribe to {{name}}</h1>

            <div id='subscriberView'>
            </div>
        `), {
            name: s.name
        });
        new s.class("#subscriberView");

        document.addEventListener('preview', (ev) => {
            this.#preview(ev.detail);
        });
    }

    #preview(url) {
        render(this.selector, template(`
            <nav>
                    <a href='#/'>Back to Overview</a>
            </nav>

            <h3>Feed PREVIEW</h3>
            
            {{url}}
        `), {
            url
        });
    }
};