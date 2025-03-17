// vim: set ts=4 sw=4:
import { Subscriber } from "../Subscriber.js";

export class SubscriberImpl extends Subscriber {
	static name = "YouTube";
	static favicon = "youtube.png";

	constructor(selector) {
		super();

		this.render(selector, `
			<div class="block">
				<form id="youtubeForm">
					<p>
						Please enter the YouTube channel id (something like "UC_xxxxxxxxxxxxxx") to subscribe to the channel.
						To find the channel id on any YouTube channel open the HTML source view and search for "channel/UC_".
					</p>
					<input type="text" id="channelId" name="channelId" placeholder="YouTube Channel ID" required>
					<button type="submit">Subscribe</button>
				</form>
			</div>
        `, {});

		document.getElementById('youtubeForm').addEventListener('submit', (event) => {
			event.preventDefault();
			const channelId = document.getElementById('channelId').value;
			this.preview(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`);
		});
	}
};
