"use client";
import { GroupDiscoverySummarySchemaType } from "@/src/schemas/groups/groupSchema";
import GroupsPagesContainer from "../../../sections/group/containers/groupsPages";
import FadeIn from "../../../ui/box/motionboxes/fadeIn";

type RenderGroupsOrFallbackProps = {
  pages: GroupDiscoverySummarySchemaType[][];
};

export default function RenderMyGroups({ pages }: RenderGroupsOrFallbackProps) {
  return (
    <FadeIn keyValue="groups-pages-contianer-fade-wrapper">
      <GroupsPagesContainer
        cardVariant="dashboard"
        silenceHeader={true}
        groupsPages={pages}
      />
    </FadeIn>
  );
}
