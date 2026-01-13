import { FastifyApiClient } from "./createFastifyApiClient"
import type { EventsResponse } from "../types/types";

export class EventsClient {
    private api
    constructor(api: FastifyApiClient) {
        this.api = api
    }

    getEvents(): Promise<EventsResponse> {
        return this.api.get("/api/events/getEvents");
    }
}