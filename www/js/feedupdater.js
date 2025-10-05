// vim: set ts=4 sw=4:

// Download, parse and merge feeds

import { parserAutoDiscover } from './parsers/autodiscover.js';
import { Feed } from './feed.js';
import { pfetch } from './net.js';

export class FeedUpdater {
    // returns a feed properties or at least error code (e.g. "{ error: Feed.ERROR_XML }")
    // result should be merged into the feed being updated
    static async fetch(url, corsProxyAllowed = false) {
        console.info(`Updating ${url}`);
        var feed = await pfetch(url, {}, corsProxyAllowed)
            .then((response) => {
                // FIXME: proper network state handling
                return response.text()
            })
            .then(async (str) => {
                let parser = parserAutoDiscover(str, url);
                if(!parser)
                    return new Feed({ error: Feed.ERROR_DISCOVER });

                let feed = parser.parse(str);
                if(!feed) {
                    console.error(`Failed to parse feed from ${url}`);
                    return new Feed({ error: Feed.ERROR_XML });
                }
                feed.source = url;
                feed.last_updated = Date.now() / 1000;
                feed.error = Feed.ERROR_NONE;
                return feed;
            })
            .catch((e) => {
                console.log(e);
                
                // FIXME: provide HTTP status too
                return new Feed({ error: Feed.ERROR_NET });
            });
        return feed;
    }
}