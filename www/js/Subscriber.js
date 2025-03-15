// vim: set ts=4 sw=4:

import { render, template } from "./helpers/render.js";

export class Subscriber {
        render(selector, str, params) {
                render(selector, template(str), params);
        }

        preview(url) {
                document.dispatchEvent(new CustomEvent('preview', {
                        detail: url
                }));
        }
};