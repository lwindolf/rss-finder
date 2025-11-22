import fs from 'fs';
import path from 'path';

// Mock some deps
global.window = {};
window.Handlebars = {
    registerHelper: () => {},
    compile: () => {}
}

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

console.log('Done.');