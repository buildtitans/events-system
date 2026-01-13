import { FastifyApiClient } from "./createFastifyApiClient";

export class GroupsClient {
    private api
    constructor(api: FastifyApiClient) {
        this.api = api
    }

    getGroups() {
        return this.api.get("/api/groups/getGroups");
    }
}