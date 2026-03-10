import { DbUserSchemaType } from "@/src/schemas/auth/userSchema";
import type { DBClient } from "../db";
import { mapRoleBasedAccessControls } from "../lib/utils/mapRoleBasedAccessControls";
import {
  AttendanceDictionaryType,
  mapAttendanceDictionary,
} from "../lib/utils/mapAttendanceDictionary";
import { RBACType } from "../db/clients/types/types";

export async function buildCache(
  api: DBClient,
  user_id?: DbUserSchemaType["id"],
): Promise<{ roles: RBACType; attendanceDict: AttendanceDictionaryType }> {
  const groupIds = (await api.groups.getGroups()).map((group) => group.id);
  const eventIds = (await api.events.getFlattenedEvents()).map(
    (event) => event.id,
  );

  const memberships = user_id
    ? await api.groupMembers.getViewerMemberships(user_id)
    : null;

  const attendance = user_id
    ? await api.eventAttendants.getUserAttendanceRecords(user_id)
    : [];

  const roles = mapRoleBasedAccessControls(groupIds, memberships);
  const attendanceDict = mapAttendanceDictionary(eventIds, attendance);

  return {
    roles,
    attendanceDict,
  };
}
