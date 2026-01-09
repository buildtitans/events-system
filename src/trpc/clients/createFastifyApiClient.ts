
export class FastifyApiClient {
    constructor(private url: string) {
        this.url = url
    }

    async getEvents() {
        const res = await fetch(`${this.url}/api/events`, { method: "GET" });
        if (!res.ok) {
            console.error(res.status, res.statusText)
            throw new Error(`GET to ${this.url}/api/events failed: ${res.status} ${res.statusText}`);
        }
        return res.json();
    }

    async getGroups() {
        const res = await fetch(`${this.url}/api/groups`, { method: "GET" });

        if (!res.ok) {
            console.error(res.status, res.statusText, `Queried URL:${this.url}/api/events`);
            throw new Error(`GET to ${this.url}/api/events failed: ${res.status} ${res.statusText}`);
        }
        return res.json();
    }



};