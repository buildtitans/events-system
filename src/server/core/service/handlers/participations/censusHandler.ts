import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import { ICensusHandler } from "./types";
import type { ParticipationsServiceDb } from "@/src/server/core/service/services/types";

export class CensusHandler implements ICensusHandler {
  constructor(private readonly api: ParticipationsServiceDb) {}

  async getPopularGroups(): Promise<GroupSchemaType[]> {
    return await this.api.groups.select.popular();
  }
}
