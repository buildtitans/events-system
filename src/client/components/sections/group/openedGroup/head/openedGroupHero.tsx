import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import { Divider, Stack } from "@mui/material";
import GroupHeadSecton from "./groupHeadSection";
import GroupDescription from "./groupDescription";
import {
  openedGroupHeroDividerSx,
  openedGroupHeroInnerSx,
} from "@/src/client/styles/sx/openedGroupHero";

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
