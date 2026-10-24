import type { TimelineElementSchemaType } from "@/src/schemas/groups/timelineSchema";
import { Selectable } from "kysely";
import { EventSchemaType } from "../../../../../../schemas/events/eventSchema";
import { Events } from "../../../types/db";
import { RawGroupEvent, ReadGroupEvent } from "../events/types";

export type RawGroupForDiscovery = {
  description: string | null;
  id: string;
  name: string;
  slug: string;
  location: string | null;
  category_name: string;
  member_count: string | number | bigint | null;
  next_event: {
    id: string;
    description: string;
    starts_at: string;
    title: string;
    going: string | number;
    interested: string | number;
  } | null;
};

export type RawArchives = {
  event: Selectable<Events>;
  attendance: {
    going: number;
    interested: number;
  };
}[];

export type RawReadArchivedEvent = {
  created_at: Date;
  description: string;
  id: string;
  updated_at: Date;
  group_id: string;
  img: string;
  meeting_location: string;
  starts_at: Date;
  status: string;
  tag: string | null;
  title: string;
  going: string | number | bigint;
  interested: string | number | bigint;
};

export type RawSearchResult = {
  description: string | null;
  id: string;
  location: string | null;
  name: string;
  slug: string;
  category_name: string;
  member_count: string | number | bigint | null;
  next_event_scheduled: Date | null;
};

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
      viewer_role: string;
      group_events: RawGroupEvent[];
      calandar: TimelineElementSchemaType[];
      next_event: NextEventForGroupRead;
    }
  | {
      organizer_email: string;
      category_name: string;
      member_count: number;
      viewer_role: string;
      group_events: RawGroupEvent[];
      calandar: TimelineElementSchemaType[];
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

type GroupEventQueryResult = Omit<
  ReadGroupEvent,
  "starts_at" | "category_name" | "going_count" | "interested_count"
> & {
  starts_at: string;
  going_count: string | number;
  interested_count: string | number;
};

type NextGroupEventRead = {
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

export type ReadHydratedGroupResult = {
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
  next_event: NextGroupEventRead;
  group_events: GroupEventQueryResult[];
  calandar: (Omit<ReadTimelineItem, "starts_at" | "created_at" | "number_attended"> & {
    starts_at: string;
    created_at: string;
    number_attended: string | number;
  })[];
  viewer_role: string;
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
