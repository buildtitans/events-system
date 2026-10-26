export type RawWrittenNotification = {
  created_at: Date;
  group_id: string;
  id: string;
  subject: string;
  message: string;
  priority: string;
  status: string;
  updated_at: Date | null;
  user_id: string;
};

export type RawReadNotification = {
  created_at: string;
  group_id: string;
  id: string;
  message: string;
  priority: string;
  status: string;
  subject: string;
  updated_at: string | null;
  user_id: string;
  group_slug: string;
  group_name: string;
};

export type RawUserNotifications = {
  new: RawReadNotification[];
  seen: RawReadNotification[];
};

export type ReadNotifications = {
  new: {
    created_at: string;
    group_id: string;
    id: string;
    message: string;
    priority: string;
    status: string;
    subject: string;
    updated_at: string | null;
    user_id: string;
    group_slug: string;
    group_name: string;
  }[];
  seen: {
    created_at: string;
    group_id: string;
    id: string;
    message: string;
    priority: string;
    status: string;
    subject: string;
    updated_at: string | null;
    user_id: string;
    group_slug: string;
    group_name: string;
  }[];
};

export type NotificationsShape = {
  new: {
    kind: string;
    data: {
      created_at: string;
      group_id: string;
      id: string;
      message: string;
      priority: string;
      status: string;
      subject: string;
      updated_at: string | null;
      user_id: string;
    };
    meta: {
      group_name: string;
      group_slug: string;
    };
  }[];
  seen: {
    kind: string;
    data: {
      created_at: string;
      group_id: string;
      id: string;
      message: string;
      priority: string;
      status: string;
      subject: string;
      updated_at: string | null;
      user_id: string;
    };
    meta: {
      group_name: string;
      group_slug: string;
    };
  }[];
};

export type WrittenNotification = {
  group_id: string;
  priority: string;
  message: string;
  subject: string;
  created_at: Date;
  id: string;
  status: string;
  updated_at: Date | null;
  user_id: string;
  group_slug: string;
  group_name: string;
};

export type NewNotificationShape = {
  kind: string;
  data: {
    group_id: string;
    priority: string;
    message: string;
    subject: string;
    id: string;
    status: string;
    user_id: string;
    created_at: string;
    updated_at: string | null;
  };
  meta: {
    group_name: string;
    group_slug: string;
  };
};

export type NotificationDto = {
  user_id: string;
  group_id: string;
  message: string;
  subject: string;
  created_at: string;
  updated_at: string | null;
  status: string;
  priority: string;
  id: string;
};
