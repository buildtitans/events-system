"use client";

import { GroupsSchemaType } from "@/src/schemas/groups/groupSchema";
import UserHasCreatedNoGroups from "../../ui/feedback/fallbacks/UserHasCreatedNoGroups";
import GroupsPagesContainer from "../../sections/group/groupsPages";

type RenderGroupsOrFallbackProps = {
  pages: GroupsSchemaType[];
};

export default function RenderGroupsOrFallback({
  pages,
}: RenderGroupsOrFallbackProps) {
  const hasPages = Array.isArray(pages) && pages.length > 0;

  if (!hasPages) {
    return <UserHasCreatedNoGroups />;
  }

  return (
    <GroupsPagesContainer
      cardVariant="dashboard"
      silenceHeader={true}
      groupsPages={pages}
    />
  );
}
