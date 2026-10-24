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
