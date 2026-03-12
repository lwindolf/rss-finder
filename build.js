import fs from 'fs';
import path from 'path';

// Mock some deps
global.window = {};
window.RssFinder = {};
window.RssFinder.settings = {};
window.Handlebars = {
    registerHelper: () => {},
    compile: () => {}
}

const statusFile = path.join('www', 'data', 'status.json');
const outputFile = path.join('www', 'js', 'SubscriberList.js');
const subscriberPath = path.join('www', 'js', 'subscribers');
const subscriberFiles = fs.readdirSync(subscriberPath).filter(file => file.endsWith('.js')).sort();

let subscribers = [];
await Promise.all(subscriberFiles.map(async file => {
    console.log('Processing ./' + path.join(subscriberPath, file));
    const m = await import('./' + path.join(subscriberPath, file));
    const s = m.SubscriberImpl;
    subscribers.push({
        name: s.name,
        module: file,
        favicon: s.favicon
    });
}));

console.log(`Writing ${outputFile} ...`);
fs.writeFileSync(outputFile, `
export class SubscriberList {
    static #subscribers = ${JSON.stringify(subscribers.sort((a, b) => a.module.localeCompare(b.module)), null, 2)};

    static getByName = (name) => SubscriberList.#subscribers.find(s => s.name === name);
    static getAll = () => SubscriberList.#subscribers;
}`);

console.log(`Writing ${statusFile} ...`);
const now = Math.ceil(new Date() / 1000);
// FIXME: hard-coded interval (pipeline runs at least weekly)
const refreshInterval = 7 * 24 * 60 * 60;
fs.writeFileSync(statusFile, JSON.stringify({ 
    meta: {
        name: "RSS Finder Build",
        links: {
            "Website": "https://lwindolf.github.io/rss-finder/",
            "GitHub": "https://github.com/lwindolf/rss-finder"
        },
        favicon: "https://lwindolf.github.io/rss-finder/icons/default.svg"
    },
    schedule: {
        lastUpdate : now,
        refresh    : refreshInterval,
        nextRun    : refreshInterval + now,
        maxAge     : refreshInterval * 2
    }
}, null, 2));

console.log('Done.');