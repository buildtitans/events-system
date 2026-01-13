import { Endpoints } from "../types/types";
import { EventsClient } from "./createFastifyEventsClient"
import { GroupsClient } from "./createFastifyGroupsClient";

export class FastifyApiClient {
    private readonly baseUrl;
    public readonly events: EventsClient
    public readonly groups: GroupsClient
    constructor(baseUrl: string) {
        this.baseUrl = baseUrl
        this.events = new EventsClient(this);
        this.groups = new GroupsClient(this);
    }

    async get<T>(path: Endpoints) {

        const url = `${this.baseUrl}${path}`;
        const res = await fetch(url, { method: "GET" });

        if (!res.ok) {

            throw new Error(`GET to ${url} failed: ${res.status} - ${res.statusText} `);
        }

        return res.json() as Promise<T>
    };
};