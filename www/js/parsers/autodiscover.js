// vim: set ts=4 sw=4:

// for a given HTML document link return all feed links found
export function linkAutoDiscover(str, baseURL) {
    let doc;
    
    // Try to parse as HTML
    try {
        doc = new DOMParser().parseFromString(str, 'text/html');
    } catch {
        console.info("Link discovery: could not parse HTML!");
    }

    if (!doc)
        return [];

    let results = [];

    // Try DOM based extraction (this fails on unclosed <link> tags)
    doc.head.querySelectorAll('link[rel="alternate"]').forEach((n) => {
        const type = n.getAttribute('type');
        if (!type)
                return
        if ((type === 'application/atom+xml') ||
            (type === 'application/rss+xml') ||
            (type === 'application/rdf+xml') ||
            (type === 'text/xml'))
            results.push(n.getAttribute('href'));
    });

    // Fuzzy extract link tags from HTML string
    if(results.length === 0) {
        const linkPattern = /<link[^>]*>/g;
        const hrefPattern = /href="([^"]*)"/;
        const relPattern = /rel=["']alternate["']/;
        const typePattern = /type=["']([^"']+)["']/;

        let match;
        while ((match = linkPattern.exec(str)) !== null) {
                const relMatch = relPattern.exec(match[0]);
                const hrefMatch = hrefPattern.exec(match[0]);
                const typeMatch = typePattern.exec(match[0]);
                const type = typeMatch ? typeMatch[1] : null;
                const url = hrefMatch ? hrefMatch[1] : null;

                if (url && type && relMatch)
                        if ((type === 'application/atom+xml') ||
                            (type === 'application/rss+xml') ||
                            (type === 'application/rdf+xml') ||
                            (type === 'text/xml'))
                                results.push(url);
        }
    }

    results = results.map((href) => {
        if (!href.includes("://")) {
            var u = new URL(baseURL);
            if (href.startsWith('/'))
                u.pathname = href;
            else
                u.pathname += "/" + href;
            return u.href;
        } else {
            return href;
        }
    });

    return results;
};