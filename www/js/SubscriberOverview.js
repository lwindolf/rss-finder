// vim: set ts=4 sw=4:

// Simple view where the user can select all available feed discovery types.
// Servers as start page for the user.

import { render, template } from "./helpers/render.js";

export class SubscriberOverview {
	static subscribers = {};

	constructor(selector) {
		render(selector, template(`
			<h1>Discover Feeds</h1>

			<div class='subscriberList'>
				{{#each subscribers}}
					<a href='#/subscriber/{{routeName}}'>
						<div class='subscriber block'>
							<img src='{{favicon}}'/>
							<div class='subscriberTitle'>{{name}}</div>
						</div>
					</a>
				{{/each}}
			</div>
		`), {
			subscribers: window.subscribers
		});
	};
};
