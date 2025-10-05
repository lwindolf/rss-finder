// vim: set ts=4 sw=4:

// Simple fetch wrapper to allow for automatic CORS proxy

import { Config } from './config.js';

// Fetch and URL normally or via CORS proxy
async function pfetch(url, options = {}, CORS = false) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

    options.signal = controller.signal;

    try {
        if (!CORS)
            return await fetch(url, options);

        // We expect only CORS proxy URLs where we just need to add the encoded URL
        return await fetch(Config.corsProxy+encodeURI(url), options);
    } catch (error) {
        console.error('Fetch error:', error);
    } finally {
        clearTimeout(timeoutId);
    }
}

export { pfetch };