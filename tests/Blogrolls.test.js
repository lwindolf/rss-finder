// vim: set ts=4 sw=4:

test("parseOPMLOutlines includes htmlUrl-only entries", async () => {
    const { parseOPMLOutlines } = await import("../www/js/helpers/opml.js");
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
        <opml version="2.0">
            <body>
                <outline text="Example Blog" htmlUrl="https://example.com/" />
            </body>
        </opml>`;
    const xmlDoc = new DOMParser().parseFromString(xml, 'text/xml');

    expect(parseOPMLOutlines(xmlDoc.querySelector("body"))).toEqual({
        children: [
            {
                text: "Example Blog",
                htmlUrl: "https://example.com/"
            }
        ]
    });
});

test("parseOPMLOutlines keeps xmlUrl entries as feeds", async () => {
    const { parseOPMLOutlines } = await import("../www/js/helpers/opml.js");
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
        <opml version="2.0">
            <body>
                <outline text="Example Feed" xmlUrl="https://example.com/feed.xml" />
            </body>
        </opml>`;
    const xmlDoc = new DOMParser().parseFromString(xml, 'text/xml');

    expect(parseOPMLOutlines(xmlDoc.querySelector("body"))).toEqual({
        children: [
            {
                text: "Example Feed",
                url: "https://example.com/feed.xml"
            }
        ]
    });
});
