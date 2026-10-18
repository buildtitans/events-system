import { GroupEventSummarySchemaType } from "@/src/schemas/events/eventSchema";
import type { EventTimelineDb, IEventTimelineHandler } from "./types";

export class EventTimelineHandler implements IEventTimelineHandler {
  constructor(private readonly db: EventTimelineDb) {}

  async getPastEventsForGroup(
    group_id: string,
  ): Promise<GroupEventSummarySchemaType[]> {
    return await this.pastEventsForGroup(group_id);
  }

  private async pastEventsForGroup(
    group_id: string,
  ): Promise<GroupEventSummarySchemaType[]> {
    const groupEvents = await this.db.events.select.byGroupId(group_id);
    const history: GroupEventSummarySchemaType[] = [];
    const now = Date.now();

    for (const { event, meta } of groupEvents) {
      if (event.starts_at_ms < now) {
        const data = { event, meta };
        history.push(data);
      }
    }
    history.sort((a, b) => a.event.starts_at_ms - b.event.starts_at_ms);

    return history;
  }
}
