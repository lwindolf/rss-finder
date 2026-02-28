// vim: set ts=4 sw=4:

// Simple view where the user can select all available feed discovery types.
// Servers as start page for the user.

import { SubscriberList } from "./SubscriberList.js";
import { SubscriberView } from "./SubscriberView.js";
import * as r from "./helpers/render.js";

export class SubscriberOverview {
	constructor(el) {
		this.#render(el);

		el.addEventListener("click", (event) => {
			const div = event.target.closest(".subscriber");
			if (div) {
				event.preventDefault();
				new SubscriberView(el, div.dataset.name);
			}
		});

		document.addEventListener('rss-finder-back', () => {
			this.#render(el);
		});
	}

	async #render(el) {
		r.renderElement(el, r.template(`
			{{#compare settings.show-title "==" "true"}}
			<h1>Discover Feeds</h1>
			{{/compare}}

			<div class='subscriberList'>
				{{#each subscribers}}
					<a name='{{name}}'>
						<div class='subscriber block' data-name='{{name}}'>
							<img src='{{../settings.base-path}}/icons/{{favicon}}'/>
							<div class='subscriberTitle'>{{name}}</div>
						</div>
					</a>
				{{/each}}
			</div>
		`), {
			subscribers: SubscriberList.getAll(),
			settings: window.RssFinder.settings
		});
	}
}
