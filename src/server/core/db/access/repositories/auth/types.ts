export type RawReadSession =
  | {
      id: string;
      created_at: Date;
      expires_at: Date;
      email: string;
      user_id: string;
    }
  | undefined;
