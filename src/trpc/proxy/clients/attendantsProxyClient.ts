import type { EventAttendantsSchemaType } from "@/src/schemas/events/eventAttendantsSchema";
import { ProxyHttpClient } from "./proxyHTTPClient";

type PrivateUserAttendanceUpdate = Pick<
  EventAttendantsSchemaType,
  "event_id" | "user_id"
>;

export class AttendantsProxyClient {
  constructor(private readonly http: ProxyHttpClient) {}

  async getAllAttendanceRecords() {
    return await this.http.get("/events/popular/ids");
  }

  async getUserAttendanceRecords(): Promise<EventAttendantsSchemaType[]> {
    return await this.http.get("/users/me/attendance-records");
  }

  async updateAttendanceStatus(
    attendant: PrivateUserAttendanceUpdate,
    newStatus: EventAttendantsSchemaType["status"],
  ): Promise<EventAttendantsSchemaType> {
    return await this.http.post(
      `/users/me/attendance/events/${attendant.event_id}/status`,
      {
        attendant,
        newStatus,
      },
    );
  }

  async getViewerAttendance(event_id: string) {
    return await this.http.get(`/events/${event_id}/viewer-attendance`);
  }
}
