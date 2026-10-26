export type RawReadHydratedEvent = {
  id: string;
  group_id: string;
  status: string;
  starts_at: Date;
  img: string;
  tag: string | null;
  title: string;
  description: string;
  meeting_location: string;
  created_at: Date;
  updated_at: Date;
  group_name: string;
  group_slug: string;
  viewer_role: string;
  viewer_status: string;
  going: string | number | bigint;
  interested: string | number | bigint;
};

export type RawHydratedEventShape = {
  event: {
    id: string;
    group_id: string;
    status: string;
    starts_at: string;
    starts_at_ms: number;
    img: string;
    tag: string | null;
    title: string;
    description: string;
    meeting_location: string;
    created_at: string;
    updated_at: string | null;
  };
  meta: {
    event: {
      group_name: string;
      group_slug: string;
      attendants: {
        going: number;
        interested: number;
      };
    };
    user: {
      status: string;
      role: string;
    };
  };
};

export type ReadSearchResult = {
  id: string;
  description: string;
  group_id: string;
  img: string;
  starts_at: Date;
  tag: string | null;
  title: string;
  group_name: string;
  group_location: string | null;
  group_slug: string;
  going: string | number | bigint;
  interested: string | number | bigint;
  timeline_status: "past" | "today" | "upcoming";
  event_phase: "ended" | "ongoing" | "not_yet_held";
};

export type ReadSuggestedEvent = {
  id: string;
  group_id: string;
  starts_at: Date;
  title: string;
  group_name: string;
  group_location: string | null;
  group_slug: string;
};

export type ReadNextEvent =
  | {
      group_id: string;
      description: string;
      id: string;
      img: string;
      meeting_location: string;
      starts_at: Date;
      status: string;
      tag: string | null;
      title: string;
      category_name: string;
      going: number;
      interested: number;
    }
  | undefined;

export type ReadGroupEvent = {
  group_id: string;
  id: string;
  status: string;
  starts_at: Date;
  img: string;
  tag: string | null;
  title: string;
  meeting_location: string;
  category_name: string | null;
  going_count: number;
  interested_count: number;
};

export type EventForDiscovery = {
  group_id: string;
  id: string;
  status: string;
  starts_at: Date;
  img: string;
  tag: string | null;
  title: string;
  group_name: string;
  group_location: string | null;
  category_name: string | null;
  going_count: number;
  interested_count: number;
};

export type RawNextEvent = {
  event: {
    group_id: string;
    description: string;
    id: string;
    img: string;
    meeting_location: string;
    status: string;
    tag: string | null;
    title: string;
    starts_at: string;
    starts_at_ms: number;
  };
  meta: {
    attendance: {
      going: number;
      interested: number;
    };
    category_name: string;
  };
};

export type RawGroupEvent = {
  event: {
    starts_at: string;
    starts_at_ms: number;
    group_id: string;
    id: string;
    status: string;
    img: string;
    tag: string | null;
    title: string;
    meeting_location: string;
  };
  meta: {
    category_name: string | undefined;
    attendance: {
      going: number;
      interested: number;
    };
  };
};

export type RawDiscoverableEvent = {
  event: {
    starts_at: string;
    starts_at_ms: number;
    group_id: string;
    id: string;
    status: string;
    img: string;
    tag: string | null;
    title: string;
  };
  meta: {
    category_name: string | undefined;
    attendance: {
      going: number;
      interested: number;
    };
    group_name: string;
    group_location: string;
  };
};
