// vim: set ts=4 sw=4:

import { Subscriber } from "./Subscriber.js";

// Helper class for simple searches
export class SearchForm extends Subscriber {
    /**
     * Create a search form inside the given element.
     * 
     * @param el            Element to render into
     * @param urlCb         Callback to generate the search URL
     * @param resultCb      Callback to render the search results
     */
    constructor(el, urlCb, resultCb) {
        super();
        this.render(el, `            
            <form id="search-form" class="block">
                    <input type="text" id="search-input" placeholder="Enter a search term">
                    <button type="submit">Search</button>
            </form>
            <div id='results'></div>
        `, {});

        const form = el.getRootNode().getElementById('search-form');
        const input = el.getRootNode().getElementById('search-input');
        const results = el.getRootNode().getElementById('results');

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const search = input.value.trim();
            if (search) {
                const url = urlCb(search);
                fetch(url)
                    .then(response => response.json())
                    .then(data => resultCb(results, data))
                    .catch(error => {
                        console.error("Error fetching data: ", error);
                    });
            }
        });
        input.focus();
    }
}