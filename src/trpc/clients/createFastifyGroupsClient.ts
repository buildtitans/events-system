import { NewGroupInputSchemaType } from "@/src/schemas/groupSchema";
import { GroupsResponse } from "../types/types";
import { FastifyApiClient } from "./createFastifyApiClient";
import type { GroupResponse } from "../types/types";

export class GroupsClient {
    private api
    constructor(api: FastifyApiClient) {
        this.api = api
    }

    getGroups(): Promise<GroupsResponse> {
        return this.api.get("/api/groups/getGroups");
    }

    createGroup(newGroup: NewGroupInputSchemaType): Promise<GroupResponse> {

        return this.api.post("/api/groups/createGroup", newGroup);
    }
}