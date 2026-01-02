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
    constructor(el, urlCb, resultCb, searchFields = [ { name: "search", type: "text", placeholder: "Enter a search term" } ]) {
        super();
        this.render(el, `            
            <form id="search-form" class="block">
                {{#each searchFields}}
                    {{#compare type '==' 'text'}}
                        <input type="{{type}}" name="{{name}}" placeholder="{{placeholder}}">
                    {{/compare}}
                    {{#compare type '==' 'select'}}
                        <p>
                            <label for="{{name}}">{{{label}}}</label>
                            <select name="{{name}}">
                                {{#each options}}
                                    <option value="{{value}}">{{label}}</option>
                                {{/each}}
                            </select>
                        </p>
                    {{/compare}}
                {{/each}}
                <button type="submit">Search</button>
            </form>
            <div id='results'></div>
        `, { searchFields });

        const form = el.getRootNode().getElementById('search-form');
        const results = el.getRootNode().getElementById('results');

        // Always focus first input field
        el.getRootNode().querySelector('input[type="text"]')?.focus();

        form.addEventListener('submit', (event) => {
            event.preventDefault();

            // Collect parameters
            const search = {};
            searchFields.forEach(field => {
                const value = el.getRootNode().querySelector(`[name="${field.name}"]`).value.trim();
                if (value) {
                    search[field.name] = value;
                }
            });

            // Run search callback
            if (Object.keys(search).length > 0) {
                results.innerHTML = 'Searching ...';
                const url = urlCb(search);
                fetch(url, {
                    allowCorsProxy: true,
                    headers: {
                        "Accept": "application/json"
                    }
                })
                .then(response => response.json())
                .then(data => resultCb(results, data))
                .catch(error => {
                    console.error("Error fetching data: ", error);
                });
            }
        });
    }
}