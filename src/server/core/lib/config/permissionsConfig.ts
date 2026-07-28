import type { Permissions } from "../../service/types";

export const permissionsConfig = {
  organizer: ["manage events", "manage group", "read or receive notifications"],
  member: ["change membership", "read or receive notifications"],
  anonymous: ["change membership"],
} as const satisfies Permissions;
