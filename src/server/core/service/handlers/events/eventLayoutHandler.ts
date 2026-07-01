import { EventSchemaType } from "../../../../../schemas/events/eventSchema";
import { DBClient } from "../../../db";
import { filterActiveEvents } from "../../../lib/utils/filterActiveEvents";
import { EventLayoutComposer } from "./eventLayoutComposer";

export class EventLayoutHandler {
  constructor(
    private readonly db: DBClient,
    private readonly composer: EventLayoutComposer,
  ) {}

  async byIds(ids: EventSchemaType["id"][]) {
    const events = await this.db.events.getEventsByIds(ids);
    return this.composer.compileLayout(events);
  }

  async all() {
    const events = await this.db.events.getEvents();
    return this.composer.compileLayout(events);
  }

  async active() {
    const events = await this.db.events.getEvents();
    return this.composer.compileLayout(filterActiveEvents(events));
  }

  async forGroup(groupId: string) {
    const events = await this.db.events.getGroupEvents(groupId);
    return this.composer.compileLayout(filterActiveEvents(events));
  }
}
