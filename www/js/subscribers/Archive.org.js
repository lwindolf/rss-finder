// https://archive.org/advancedsearch.php?q=subject%3A%22UFO+RSS%22&fl%5B%5D=identifier&sort%5B%5D=&sort%5B%5D=&sort%5B%5D=&rows=50&page=1&callback=callback&save=yes&output=rss

// vim: set ts=4 sw=4:

import { Subscriber } from "../Subscriber.js";

export class SubscriberImpl extends Subscriber {
    static name = "archive.org";
    static favicon = "archive.org.svg";

    constructor(el) {
        super();

        this.render(el, `
            <div class="result block">
                <p>Enter a search criteria to create a result feed for the <a href="https://archive.org">Internet archive</a>.</p>
                <form id="search-form">
                    Search <input type="text" id="search-input" placeholder="Search terms">
                    Language <input type="text" id="lang-input" placeholder="Optional language (e.g. 'German')">
                    <button type="submit">Preview</button>
                </form>
                <div class="result"></div>
            </div>
        `, {});

        const form      = el.getRootNode().getElementById('search-form');
        const input     = el.getRootNode().getElementById('search-input');
        const langInput = el.getRootNode().getElementById('lang-input');

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            let query = `title%3A(${encodeURI(input.value.trim())})`;
            const lang = langInput.value.trim();
            if (lang.length > 0)
                query += `+AND+Language%3A(${encodeURI(lang)})`;

            this.preview(`https://archive.org/advancedsearch.php?q=${query}&fl%5B%5D=identifier&sort%5B%5D=&sort%5B%5D=&sort%5B%5D=&rows=50&page=1&callback=callback&save=yes&output=rss`,
                el.querySelector('.result'));
        });
    }
}