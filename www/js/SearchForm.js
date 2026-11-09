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
                        <input type="{{type}}" name="{{name}}" placeholder="{{placeholder}}"{{#if value}} value="{{value}}"{{/if}}{{#if required}} required{{/if}}>
                    {{/compare}}
                    {{#compare type '==' 'hidden'}}
                        <input type="hidden" name="{{name}}"{{#if value}} value="{{value}}"{{/if}}>
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
                <button type="submit"{{#if autoSubmit}} hidden{{/if}}>Search</button>
            </form>
            <div id='results'></div>
        `, { searchFields, autoSubmit: searchFields.some(field => field.autoSubmit) });

        const form = el.getRootNode().getElementById('search-form');
        const results = el.getRootNode().getElementById('results');

        // Hidden fields with a "prompt" can be changed by the user via a link opening a dialog
        searchFields.filter(field => field.type === 'hidden' && field.prompt).forEach(field => {
            const input = form.querySelector(`input[name="${field.name}"]`);
            const info = document.createElement('p');
            info.innerHTML = `${field.intro ?? ''} <a href="#" title="Click to change"></a>`;
            const link = info.querySelector('a');
            link.textContent = input.value;
            form.prepend(info);

            link.addEventListener('click', (ev) => {
                ev.preventDefault();
                // Accept pasted URLs, only keep the host name
                const value = window.prompt(field.prompt, input.value)
                    ?.trim().replace(/^https?:\/\//, '').replace(/[/?#].*$/, '');
                if (value) {
                    input.value = value;
                    link.textContent = value;
                }
            });
        });

        // Always focus first input field
        el.getRootNode().querySelector('input[type="text"]')?.focus();

        // Fields flagged with autoSubmit trigger the search on change
        searchFields.filter(field => field.autoSubmit).forEach(field => {
            form.querySelector(`[name="${field.name}"]`)?.addEventListener('change', () => form.requestSubmit());
        });

        let requestId = 0;
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
                const id = ++requestId;
                results.innerHTML = 'Searching ...';
                const url = urlCb(search);
                fetch(url, {
                    allowCorsProxy: true,
                    headers: {
                        "Accept": "application/json"
                    }
                })
                .then(response => response.json())
                .then(data => id === requestId && resultCb(results, data))
                .catch(error => {
                    console.error("Error fetching data: ", error);
                });
            }
        });
    }
}