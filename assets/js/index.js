import { SubscriberOverview } from "./SubscriberOverview.js";
import { SubscriberView } from "./SubscriberView.js";

// FIXME handle parameters

function router() {
        const parts = window.location.hash.split('/');
        const route = parts.length > 1 ? parts[1] : undefined;
        switch (route) {
                default:
                case 'overview':
                        new SubscriberOverview('body');
                        break;
                case 'subscriber':
                        new SubscriberView('body', window.subscribers[parts[2]]);
                        break;
        }
}

window.subscribers = {};
window.addEventListener('hashchange', router);
window.addEventListener('load', async () => {
        // FIXME: generate JSON list using build.sh
        for(const routeName of [
                'Default',
                'arxiv.org',
                'Archive.org',
                'iTunes',
                'Mastodon',
                'Reddit',
                'YouTube'
        ]) {
                try {
                        const s = await import(`./subscribers/${routeName}.js`);
                        window.subscribers[routeName] = {
                                name      : s.SubscriberImpl.name,
                                favicon   : s.SubscriberImpl.favicon,
                                class     : s.SubscriberImpl,
                                routeName
                        }
                } catch(e) {
                        console.error(`Failed to load subscriber ${routeName}: ${e}`);
                }
        }

        router();
});

