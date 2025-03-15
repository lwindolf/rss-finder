// vim: set ts=4 sw=4:
import { Subscriber } from "../Subscriber.js";

export class SubscriberImpl extends Subscriber {
	static name = "YouTube";
	static favicon = "icons/youtube.png";

	constructor(selector) {
		super();

		this.render(selector, `
            <form id="youtubeForm">
                <label for="channelId">Enter YouTube Channel ID:</label>
                <input type="text" id="channelId" name="channelId" required>
                <button type="submit">Subscribe</button>
            </form>
            <p id="rssUrl"></p>
        `, {});

		document.getElementById('youtubeForm').addEventListener('submit', function (event) {
			event.preventDefault();
			const channelId = document.getElementById('channelId').value;
			const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
			document.getElementById('rssUrl').innerText = `RSS URL: ${rssUrl}`;
		});
	}
};