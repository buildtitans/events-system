import { EventSchemaType } from "../../../../../../schemas/events/eventSchema";

export type RawtimelineItem =
  | {
      timeline_status: "today";
      event: {
        id: string;
        created_at: string;
        starts_at: string;
        image: string;
        starts_at_ms: number;
      };
      event_phase: "upcoming" | "ongoing" | "completed";
    }
  | {
      timeline_status: "upcoming";
      event: {
        id: string;
        created_at: string;
        starts_at: string;
        image: string;
        starts_at_ms: number;
      };
    }
  | {
      timeline_status: "past";
      event: {
        id: string;
        created_at: string;
        starts_at: string;
        image: string;
        starts_at_ms: number;
      };
      meta: {
        number_attendend: number;
      };
    };

export type ReadTimelineItem = {
  group_id: string;
  created_at: Date;
  id: string;
  starts_at: Date;
  timeline_status: "past" | "today" | "upcoming";
  image: EventSchemaType["img"];
  number_attended: number;
};

export type RawHydratedGroup = {
  group: {
    id: string;
    created_at: Date;
    description: string | null;
    name: string;
    slug: string;
    location: string | null;
    category_id: string;
  };
};

type NextEventForGroupRead = {
  event: {
    starts_at: string;
    starts_at_ms: number;
    id: string;
    description: string;
    group_id: string;
    img: string;
    meeting_location: string;
    status: string;
    tag: string | null;
    title: string;
  };
  meta: {
    attendance: {
      going: number;
      interested: number;
    };
    category_name: string;
  };
};

type HydratedGroupReadMetadata =
  | {
      organizer_email: string;
      category_name: string;
      member_count: number;
      next_event: NextEventForGroupRead;
    }
  | {
      organizer_email: string;
      category_name: string;
      member_count: number;
    };

type GroupPrimaryData = {
  id: string;
  organizer_id: string;
  updated_at: string;
  created_at: string;
  description: string | null;
  name: string;
  slug: string;
  location: string | null;
  category_id: string;
};

export type HydratedGroupRead = {
  group: GroupPrimaryData;
  meta: HydratedGroupReadMetadata;
};

export type HydratedGroupResult = {
  id: string;
  created_at: Date;
  updated_at: Date;
  description: string | null;
  name: string;
  slug: string;
  location: string | null;
  category_id: string;
  category_name: string;
  organizer_id: string;
  organizer_email: string;
  member_count: number;
  next_event: {
    id: string;
    description: string;
    group_id: string;
    img: string;
    meeting_location: string;
    starts_at: string;
    status: string;
    tag: string | null;
    title: string;
    going_count: string | number;
    interested_count: string | number;
  } | null;
};
