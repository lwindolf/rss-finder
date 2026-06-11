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

			<h2>Catalogs</h2>

			<p>You do not know what you are searching for and want to explore new good content? Try those catalogs:</p>

			<ul>
				<li><a href='https://susam.net/wander/'>Wander Consoles</a>: wander through the internet based on personal suggestions</li>
				<li><a href='https://ooh.directory/'>OOH Directory</a>: catalog of 2400 blogs</li>
				<li><a href='https://atlasflux.saynete.net/'>Atlasflux</a>: Atlas des flux - Annuaire RSS</li>
				<li><a href='https://indieblog.page/'>Indieblog</a>: Discover random indie blogs</li>
				<li><a href='https://kagi.com/smallweb/'>Kagi Smallweb</a>: Random smallweb blog posts</li>
			</ul>
		`), {
			subscribers: SubscriberList.getAll(),
			settings: window.RssFinder.settings
		});
	}
}
