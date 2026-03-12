import { EventsPages } from "@/src/lib/store/slices/events/types";
import { layoutSlotValidator } from "@/src/lib/utils/validation/validateSchema";
import { ProxyHttpClient } from "./proxyHTTPClient";

// GOAL: imitate the DBClient's sub-client interfaces for the public facing methods
// why → the tRPC router calls can remain largely unchanged

//METHODS
// async getFlattenedEvents(): Promise<EventsArraySchemaType>
//async searchEventByTitle
//async getGroupEvents
//async searchEventByTitle(query: SearchSchemaType,): Promise<EventsArraySchemaType>
// async getGroupEventsByGroupId(group_id: GroupSchemaType["id"]): Promise<EventsArraySchemaType>
//  async getFlattenedEventsByIds(ids: EventSchemaType["id"][]): Promise<EventsArraySchemaType>
// async getEventsByIds(ids: EventSchemaType["id"][]): Promise<PaginatedLayoutSchemaType>
//  async updateEventStatus(eventUpdate: UpdateEventArgsSchemaType): Promise<{ updateStatus: "success" | "failure" }>
// async createNewEvent(newEvent: NewEventInputSchemaType): Promise<EventSchemaType | null>
//METHODS

export class EventsProxyClient {
  constructor(private readonly http: ProxyHttpClient) {
    this.http = http;
  }

  async getEvents(): Promise<EventsPages> {
    const layout = await this.http.get("/events/layout");
    return layoutSlotValidator(layout);
  }
}
