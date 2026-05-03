import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import { Box, Divider, Stack } from "@mui/material";
import GroupHeadSecton from "./groupHeadSection";
import GroupDescription from "./groupDescription";
import {
  openedGroupHeroDividerSx,
  openedGroupHeroInnerSx,
  openedGroupHeroPanelSx,
  openedGroupHeroRootSx,
} from "@/src/styles/sx/openedGroupHero";

type OpenedGroupHeroProps = {
  group: GroupSchemaType;
};

export default function OpenedGroupHero({ group }: OpenedGroupHeroProps) {
  return (
    
        <Stack sx={openedGroupHeroInnerSx} gap={3}>
          <GroupHeadSecton groupName={group.name} />
          <GroupDescription group={group} />
          <Divider sx={openedGroupHeroDividerSx} />
        </Stack>
    
  );
}
