import { Endpoints, LoginBody } from "../types/types";
import { AuthClient } from "./createAuthClient";
import { CategoriesClient } from "./createFastifyCategoriesClient";
import { EventsClient } from "./createFastifyEventsClient"
import { GroupsClient } from "./createFastifyGroupsClient";

export class FastifyApiClient {
    private readonly baseUrl: string;
    public readonly events: EventsClient
    public readonly groups: GroupsClient
    public readonly auth: AuthClient
    public readonly categories: CategoriesClient
    constructor(baseUrl: string) {
        this.baseUrl = baseUrl
        this.events = new EventsClient(this);
        this.groups = new GroupsClient(this);
        this.auth = new AuthClient(this);
        this.categories = new CategoriesClient(this)
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


    async post<T, K>(path: Endpoints, postData: T): Promise<K> {

        const url = `${this.baseUrl}${path}`;
        const res = await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
        });


        if (!res.ok) {
            const body = await res.text().catch(() => "");
            const trimmedBody = body.length > 500 ? `${body.slice(0, 500)}` : body;

            console.error("POST failed", {
                url,
                status: res.status,
                statusText: res.statusText,
                body: trimmedBody
            });
        }

        return res.json();
    }
};