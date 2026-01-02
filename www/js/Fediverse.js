export class Fediverse {
    static #data;

    static async initialize() {
        /* source file is expected to look like this

                {
                "data": {
                "nodes": [
                {
                        "name": "friendica.produnis.de",
                        "softwarename": "friendica",
                        "status": 1,
                        "domain": "friendica.produnis.de"
                },
                {
                        "name": "The Open Social Network",
                        "softwarename": "friendica",
                        "status": 1,
                        "domain": "opensocial.at"
                },
                [...]
        */       

        try {
            const response = await fetch('data/fediverse.json');
            this.#data = (await response.json()).data;
        } catch (error) {
            console.error("Error fetching Fediverse data: ", error);
        }
    }

    static getNodesBySW(name) {
        return this.#data.nodes.filter(node => node.softwarename === name);
    }
}

await Fediverse.initialize();
