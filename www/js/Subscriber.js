// vim: set ts=4 sw=4:

import { render, template } from "./helpers/render.js";
import { linkAutoDiscover } from "./parsers/autodiscover.js";

export class Subscriber {
    render(selector, str, params) {
        render(selector, template(str), params);
    }

    // Helper method for suscriber implementations that need
    // simple feed autodiscovery. Performs auto discovery and
    // present a result selection to the user.
    //
    // @param {string} data - the HTML content of the website
    // @param {string} baseUrl - the URL of the website
    autodiscover(data, baseUrl) {
        if (!document.getElementById('results')) {
            const results = document.createElement('div');
            results.id = 'results';
            document.body.append(results);
        }

        this.render('#results', `
            {{#compare results.length "==" 0}}
                <h3>
                    No feeds found!
                </h3>
                <div class='block'>
                    <p>
                        Sadly no feeds could be discovered on this website. You can manually check the website
                        footer or help section where some websites list their feed links.
                    </p>
                    <p>
                        If you know this website has feed(s) consider asking the webmasters to properly configure <a href="https://www.rssboard.org/rss-autodiscovery">RSS autodiscovery</a>.
                    </p>
                </div>
            {{/compare}}
            
            {{#compare results.length ">" 0}}
                <h3>
                    Discovered feeds:
                </h3>
                {{#each results}}
                    <div class='result block'>
                        <div class='resultDetails'>
                            <button class='subscribe'>Subscribe</button>
                            URL: <a href="{{this}}">{{this}}</a>                           
                        </div>
                    </div>
                {{/each}}
            {{/compare}}
        `, {
            results: linkAutoDiscover(data, baseUrl)
        });

        document.querySelectorAll('.subscribe').forEach((button) => {
            button.addEventListener('click', (event) => {
                this.preview(event.target.parentElement.querySelector('a').href);
            });
        });
    }

    preview(url) {
        document.dispatchEvent(new CustomEvent('preview', {
            detail: url
        }));
    }
};