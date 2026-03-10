import { DBClient } from "../db";
import { ParticipationsClient } from "./clients/participationsClient";
import { AttendanceClient } from "./clients/attendanceClient";
import { UserClient } from "./clients/userClient";

export class ServiceClient {
  public readonly participationsClient: ParticipationsClient;
  public readonly attendanceClient: AttendanceClient;
  public readonly userClient: UserClient;
  constructor(private api: DBClient) {
    this.participationsClient = new ParticipationsClient(this.api);
    this.attendanceClient = new AttendanceClient(this.api);
    this.userClient = new UserClient(this.api);
  }
}
