import type { EventsPath } from "../types/types";

export class EventsClient {
    constructor(private baseUrl: string, private path: EventsPath) {
        this.baseUrl = baseUrl
        this.path = path
    }

    async getEvents() {
        const res = await fetch(`${this.baseUrl}${this.path}`, { method: "GET" });
        if (!res.ok) {
            throw new Error(`GET to ${this.path} failed: ${res.status} ${res.statusText}`);
        }
        return res.json();
    }
};