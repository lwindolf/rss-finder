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

        // Custom URI scheme launching is somewhat complicated
        //
        // - Firefox (without default "No ask" handler): OK shows a dialog, does not open the link
        // - Firefox (with default "No ask" handler): blank page
        // - Chrome/Webkit: blank page
        //
        // To avoid blank pages we reopen the original link with a timeout.
        // (https://stackoverflow.com/questions/24779312/simplest-cross-browser-check-if-protocol-handler-is-registered)

        const oldLocation = window.location;
        setTimeout(function() {
            // Do not overwrite needlessly (so current subscriber page stays visible)
            if(window.location !== oldLocation)
                window.location = oldLocation;
        }, 200);

        window.open(window.RssFinder.settings['scheme']+url, '_self');
    }
};
