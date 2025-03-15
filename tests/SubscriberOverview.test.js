// vim: set ts=4 sw=4:

if (!window.Handlebars)
    window.Handlebars = require('handlebars');

test("SubscriberOverview", async () => {

    let s = await import("../www/js/SubscriberOverview.js");
    new s.SubscriberOverview('body');

    expect(document.body.innerHTML.indexOf('Default') !== -1).toBe(true);
    expect(document.body.innerHTML.indexOf('YouTube') !== -1).toBe(true);
});