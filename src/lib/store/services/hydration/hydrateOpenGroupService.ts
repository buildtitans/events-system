import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import type { TrpcClientType } from "@/src/trpc/trpcClient";
import { logCaughtError } from "@/src/lib/utils/errors/logCaughtError";
import type { SyncOpenGroupPayload } from "@/src/lib/store/services/types";

interface IHydrateOpenGroupService {
  hydrate(slug: GroupSchemaType["slug"]): Promise<SyncOpenGroupPayload>;
}

export class HydrateOpenGroupService implements IHydrateOpenGroupService {
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
      const group = await this.trpc.groups.select.bySlug.query(slug);

      if (!group) {
        throw new Error(`Failed to hydrate group by slug: ${slug}`);
      }

      const {
        role,
        layout,
        calandar,
        members,
        organizerEmail,
        nextEvent,
        category,
      } = await this.getGroupMetaData(group.id, group.category_id);

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
          nextEvent,
          category,
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

  private async getGroupMetaData(
    group_id: GroupSchemaType["id"],
    category_id: GroupSchemaType["category_id"],
  ) {
    const [
      role,
      layoutResult,
      calandar,
      members,
      organizer,
      nextEvent,
      category,
    ] = await Promise.all([
      this.trpc.groupMembers.select.role.query(group_id),
      this.trpc.events.layout.forGroup.query(group_id),
      this.trpc.events.select.forGroup.query(group_id),
      this.trpc.groupMembers.select.forGroup.query(group_id),
      this.trpc.groupMembers.select.organizerEmail.query(group_id),
      this.trpc.events.select.nextEventForGroup.query(group_id),
      this.trpc.groups.select.categoryById.query(category_id ?? ""),
    ]);

    return {
      role,
      layout: layoutResult ?? [],
      calandar,
      members,
      organizerEmail: organizer.email,
      nextEvent,
      category,
    };
  }
}
