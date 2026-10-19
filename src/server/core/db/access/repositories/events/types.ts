export type RawHydratedEvent = {
  event: {
    starts_at: string;
    starts_at_ms: number;
    created_at: string;
    updated_at: string;
    id: string;
    group_id: string;
    status: string;
    img: string;
    tag: string | null;
    title: string;
    description: string;
    meeting_location: string;
  };
  meta: {
    group_name: string;
    group_slug: string;
    attendants: {
      going: number;
      interested: number;
    };
  };
};

export type EventById = {
  event: {
    starts_at: string;
    starts_at_ms: number;
    id: string;
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
    group_name: string;
    group_location: string;
    category_name: string;
  };
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
