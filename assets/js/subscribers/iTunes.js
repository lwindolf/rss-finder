// vim: set ts=4 sw=4:
import { Subscriber } from "../Subscriber.js";

export class SubscriberImpl extends Subscriber {
    static name = "iTunes";
    static favicon = "itunes.svg";

    constructor(selector) {
        super();

        this.render(selector, `            
            <form id="search-form" class="block">
                <input type="text" id="search-input" placeholder="Enter a search term">
                <button type="submit">Search</button>
            </form>
            <div id='results'></div>
        `, {});

        {
            const form = document.getElementById('search-form');
            const input = document.getElementById('search-input');

            form.addEventListener('submit', (event) => {
                event.preventDefault();
                const search = input.value.trim();
                if (search) {
                    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(search)}&media=podcast&entity=podcast&limit=20&version=2&output=json`;
                    fetch(url)
                        .then(response => response.json())
                        .then(data => {
                            this.#renderResults('#results', data);
                            console.log(data)
                        })
                        .catch(error => {
                            console.error("Error fetching data: ", error);
                        });
                }
            });
        }
    }

    #renderResults(selector, data) {
        this.render(selector, `            
            {{#each results}}
                <div class='result block'>
                    <div class='resultImage'>
                        <img src='{{artworkUrl100}}'/>
                    </div>
                    <div class='resultDetails'>
                        <div class='resultTitle'><a href="{{collectionViewUrl}}">{{collectionName}}</a></div>
                        <div class='resultArtist'>{{artistName}}</div>
                        <div class='resultGenre'>
                            {{#each genres}}
                                <span>{{this}}</span>
                            {{/each}}
                        </div>
                        <div class='resultFeedHidden'>{{feedUrl}}</div>
                        <button class='subscribe'>Subscribe</button>
                    </div>
                </div>
            {{/each}}
        `, {
            results: data.results
        });

        document.querySelectorAll('.resultDetails button.subscribe').forEach((button, index) => {
            button.addEventListener('click', (ev) => {
                const result = ev.target.closest('.result');
                this.preview(result.querySelector('.resultFeedHidden').textContent);       
            })
        });
    }
};
