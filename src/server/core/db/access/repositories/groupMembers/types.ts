export type GroupMembershipRead = {
  group_name: string;
  group_slug: string;
  location: string | null;
  category_name: string | null;
  roleInGroup: string;
  group_description: string | null;
  group_id: string;
  member_headcount: string | number | bigint | null;
  next_event_scheduled: Date | null;
  todays_event: Date | null;
  last_event_held: Date | null;
};
