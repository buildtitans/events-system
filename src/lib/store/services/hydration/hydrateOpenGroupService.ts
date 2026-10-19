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
      const hydrated = await this.trpc.hydrate.groups.single.query(slug);

      if (!hydrated) {
        throw new Error(`Failed to hydrate group by slug: ${slug}`);
      }

      const { role, layout, calandar } = await this.getGroupMetaData(
        hydrated.group.id,
      );

      return {
        ok: true,
        data: {
          hydrated,
          role,
          layout,
          calandar,
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
    const [layoutResult, role, calandar] = await Promise.all([
      this.trpc.hydrate.events.layouts.forGroup.query(group_id),
      this.trpc.entities.group.member.role.query(group_id),
      this.trpc.entities.group.events.timeline.query(group_id),
    ]);

    return {
      role,
      layout: layoutResult ?? [],
      calandar,
    };
  }
}
