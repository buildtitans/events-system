
export class FastifyApiClient {
    constructor(private baseUrl: string) {
        this.baseUrl = baseUrl
    }

    async getEvents() {
        const res = await fetch(`
            ${this.baseUrl}/api/events`,
            {
                method: "GET"
            }
        );
        if (!res.ok) {
            console.error(res.status, res.statusText)
            throw new Error(`GET to ${this.baseUrl}/api/events failed: ${res.status} ${res.statusText}`);
        }
        return res.json();
    }

    async getGroups() {
        const res = await fetch(`
            ${this.baseUrl}/api/groups`,
            {
                method: "GET"
            }
        );

        if (!res.ok) {
            console.error(res.status, res.statusText, `Queried URL:${this.baseUrl}/api/events`);
            throw new Error(`GET to ${this.baseUrl}/api/events failed: ${res.status} ${res.statusText}`);
        }
        return res.json();
    }
};