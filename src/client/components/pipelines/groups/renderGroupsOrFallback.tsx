"use client";

import { GroupsSchemaType } from "@/src/schemas/groups/groupSchema";
import GroupsPagesContainer from "../../sections/group/groupsPages";
import DashboardFallback from "../../ui/feedback/fallbacks/dashboardFallback";
import CreateNewGroupButton from "../../ui/buttons/createNewGroupButton";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import { noGroupsFallbackIconSx } from "@/src/client/styles/sx/noGroupsFallback";
import { Fade } from "@mui/material";
import FadeIn from "../../ui/box/motionboxes/fadeIn";

type RenderGroupsOrFallbackProps = {
  pages: GroupsSchemaType[];
};

export default function RenderGroupsOrFallback({
  pages,
}: RenderGroupsOrFallbackProps) {
  const hasPages = Array.isArray(pages) && pages.length > 0;
  const action = () => {
    return <CreateNewGroupButton />;
  };
  const icon = () => {
    return <GroupRoundedIcon sx={noGroupsFallbackIconSx} />;
  };

  if (!hasPages) {
    return (
      <FadeIn keyValue={"dashboard-fallback"}>
        <DashboardFallback
          action={action()}
          icon={icon()}
          eyeBrow={"Workspace"}
          fallbackTitle={"No groups created yet"}
          fallbackBody={
            "Create your first community to start organizing events, invite members, and build a shared schedule around the things you care about."
          }
        />
      </FadeIn>
    );
  }

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
