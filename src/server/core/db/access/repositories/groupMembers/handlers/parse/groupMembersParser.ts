import { GroupScheduleSchemaType } from "../../../../../../../../schemas/groups/userMembershipSchema";
import { GroupMembershipRead } from "../../types";

export type GroupMembershipShape = {
  membership: {
    location: string;
    group_name: string;
    group_slug: string;
    roleInGroup: string;
    group_description: string | null;
    group_id: string;
  };
  meta: {
    category_name: string | undefined;
    member_headcount: number;
    schedule:
      | {
          timeline_status: "no_events";
        }
      | {
          last_event_held: string;
          timeline_status: "past_only";
        }
      | {
          todays_event: string;
          timeline_status: "today_only";
        }
      | {
          next_event_scheduled: string;
          timeline_status: "upcoming";
        };
  };
};

export interface IGroupMembersParser {
  toMemberships(result: GroupMembershipRead[]): GroupMembershipShape[];
  toRole(result: { role: string } | undefined): string;
  toMemberIds(rows: { user_id: string }[]): string[];
}

export class GroupMembersParser implements IGroupMembersParser {
  public toRole(result: { role: string } | undefined): string {
    if (result === undefined) {
      return "anonymous";
    }

    return result.role;
  }

  public toMemberships(result: GroupMembershipRead[]): GroupMembershipShape[] {
    return result.map((item) => {
      const {
        next_event_scheduled,
        todays_event,
        last_event_held,
        member_headcount,
        category_name,
        location,
        ...rest
      } = item;

      return {
        membership: {
          ...rest,
          location: location ?? "Online",
        },
        meta: {
          category_name: category_name ?? undefined,
          member_headcount: Number(member_headcount),
          schedule: this.toGroupSchedule(
            next_event_scheduled,
            todays_event,
            last_event_held,
          ),
        },
      };
    });
  }

  public toMemberIds(rows: { user_id: string }[]): string[] {
    return rows.map((row) => row.user_id);
  }

  private toGroupSchedule(
    next: Date | null,
    today: Date | null,
    past: Date | null,
  ): GroupScheduleSchemaType {
    if (next) {
      return {
        timeline_status: "upcoming",
        next_event_scheduled: next.toISOString(),
      };
    }

    if (today) {
      return {
        timeline_status: "today_only",
        todays_event: today.toISOString(),
      };
    }

    if (past) {
      return {
        timeline_status: "past_only",
        last_event_held: past.toISOString(),
      };
    }

    return { timeline_status: "no_events" };
  }
}
