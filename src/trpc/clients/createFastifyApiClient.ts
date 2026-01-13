import { Endpoints } from "../types/types";
import { EventsClient } from "./createFastifyEventsClient"
import { GroupsClient } from "./createFastifyGroupsClient";

export class FastifyApiClient {
    private readonly baseUrl: string;
    public readonly events: EventsClient
    public readonly groups: GroupsClient
    constructor(baseUrl: string) {
        this.baseUrl = baseUrl
        this.events = new EventsClient(this);
        this.groups = new GroupsClient(this);
    }

    async get<T>(path: Endpoints): Promise<T> {
        const url = `${this.baseUrl}${path}`;
        const res = await fetch(url, { method: "GET" });

        if (!res.ok) {
            const body = await res
                .text()
                .catch(() => "");

            const trimmedBody = body.length > 500
                ? `${body.slice(0, 500)}…`
                : body;

            console.error("GET failed", {
                url,
                status: res.status,
                statusText: res.statusText,
                body: trimmedBody
            });

            throw new Error(`GET to ${url} failed: ${res.status} - ${res.statusText} | ${trimmedBody}`);
        }
        return res.json();
    };
};