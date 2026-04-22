// vim: set ts=4 sw=4:

export function parseOPMLOutlines(parent) {
    const result = { children: [] };
    const outlines = parent.querySelectorAll(':scope > outline');
    outlines.forEach(outline => {
        const text = outline.getAttribute('text') || outline.getAttribute('title') || outline.getAttribute('description');
        const xmlUrl = outline.getAttribute('xmlUrl');
        const htmlUrl = outline.getAttribute('htmlUrl') || outline.getAttribute('url');
        const label = text ? new DOMParser().parseFromString(text, 'text/html').documentElement.textContent : (xmlUrl || htmlUrl);
        if (!label)
            return;
        if (xmlUrl) {
            result.children.push({
                text: label,
                url: xmlUrl
            });
        } else if (htmlUrl) {
            result.children.push({
                text: label,
                htmlUrl
            });
        } else {
            result.children.push({
                text: label,
                children: parseOPMLOutlines(outline).children
            });
        }
    });
    return result;
}
