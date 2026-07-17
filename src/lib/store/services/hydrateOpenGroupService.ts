import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import type { TrpcClientType } from "@/src/trpc/trpcClient";
import { logCaughtError } from "@/src/lib/utils/errors/logCaughtError";
import type { SyncOpenGroupPayload } from "@/src/lib/store/services/types";

export class HydrateOpenGroupService {
  constructor(private readonly trpc: TrpcClientType) {}

  public async hydrate(
    slug: GroupSchemaType["slug"],
  ): Promise<SyncOpenGroupPayload> {
    return await this.getGroup(slug);
  }

  private async getGroup(
    slug: GroupSchemaType["slug"],
  ): Promise<SyncOpenGroupPayload> {
    try {
      const group = await this.trpc.groups.select.bySlug.mutate(slug);

      if (!group) {
        throw new Error(`Failed to hydrate group by slug: ${slug}`);
      }

      const { role, layout, calandar, members, organizerEmail } =
        await this.getGroupMetaData(group.id);

      const numMembers = members.length;
      return {
        ok: true,
        data: {
          group,
          role,
          layout,
          calandar,
          numMembers,
          organizerEmail,
        },
      };
    } catch (err) {
      logCaughtError("HydrateOpenGroupService.getGroup()", err);
      return this.createEmptyOpenGroupPayload();
    }
  }

  private createEmptyOpenGroupPayload(): SyncOpenGroupPayload {
    return {
      ok: false,
      error: "Failed to hydrate group selected",
    };
  }

  private async getGroupMetaData(group_id: GroupSchemaType["id"]) {
    const role = await this.trpc.groupMembers.select.role.mutate(group_id);
    const layout =
      (await this.trpc.events.layout.forGroup.mutate(group_id)) ?? [];
    const calandar = await this.trpc.events.select.forGroup.mutate(group_id);
    const members =
      await this.trpc.groupMembers.select.forGroup.mutate(group_id);
    const { email } =
      await this.trpc.groupMembers.select.organizerEmail.mutate(group_id);

    return {
      role,
      layout,
      calandar,
      members,
      organizerEmail: email,
    };
  }
}
