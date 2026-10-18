import { NotificationSchemaType } from "@/src/schemas/notifications/notificationsSchema";
import type { TrpcClientType } from "@/src/trpc/trpcClient";

interface IHydrateUserService {
  recoverSession(): Promise<{
    session: {
      id: string;
      expires_at: Date;
      user_id: string;
    };
    email: string;
  } | null>;
  notifications(): Promise<{
    new: NotificationSchemaType[];
    seen: NotificationSchemaType[];
  }>;
}

export class HydrateUserService implements IHydrateUserService {
  constructor(private readonly trpc: TrpcClientType) {}

  public async recoverSession(): Promise<{
    session: {
      id: string;
      expires_at: Date;
      user_id: string;
    };
    email: string;
  } | null> {
    return await this.trpc.auth.status.recover.query();
  }

  public async notifications(): Promise<{
    new: NotificationSchemaType[];
    seen: NotificationSchemaType[];
  }> {
    return await this.trpc.notifications.select.newAndViewed.query();
  }
}
