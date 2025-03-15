// vim: set ts=4 sw=4:
import { Subscriber } from "../Subscriber.js";

export class SubscriberImpl extends Subscriber {
    static name = "iTunes";
    static favicon = "icons/itunes.svg";

    constructor(selector) {
        super();

        this.render(selector, `            
            <form id="search-form">
                <input type="text" id="search-input" placeholder="Enter a search term">
                <button type="submit">Search</button>
            </form>
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
                            console.log(data)
                        })
                        .catch(error => {
                            console.error("Error fetching data: ", error);
                        });
                }
            });
        }


        // curl "" | jq .
    }
};