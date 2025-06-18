// vim: set ts=4 sw=4:

// Simple view where the user can select all available feed discovery types.
// Servers as start page for the user.

import { SubscriberView } from "./SubscriberView.js";
import * as r from "./helpers/render.js";

export class SubscriberOverview {
	constructor(el, subscribers, parameters) {
		r.renderElement(el, r.template(`
			{{#if parameters.show-title }}
			<h1>Discover Feeds</h1>
			{{/if}}

			<div class='subscriberList'>
				{{#each subscribers}}
					<a name='{{routeName}}'>
						<div class='subscriber block'>
							<img src='assets/icons/{{favicon}}'/>
							<div class='subscriberTitle'>{{name}}</div>
						</div>
					</a>
				{{/each}}
			</div>
		`), {
			subscribers,
			parameters
		});

		el.addEventListener("click", (event) => {
			const div = event.target.closest(".subscriber");
			if (div) {
				event.preventDefault();
				const routeName = div.parentElement.name;
				if (routeName) {
					new SubscriberView(el, subscribers[routeName], parameters);
				}
			}
		});
	}
}
