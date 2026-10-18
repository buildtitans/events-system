import type { GroupHydratedSchemaType } from "@/src/schemas/groups/groupSchema";
import { Divider, Stack } from "@mui/material";
import GroupHeadSecton from "./groupHeadSection";
import GroupDescription from "./groupDescription";
import {
  openedGroupHeroDividerSx,
  openedGroupHeroInnerSx,
} from "@/src/client/styles/sx/openedGroupHero";

type OpenedGroupHeroProps = {
  hydrated: GroupHydratedSchemaType;
};

export default function OpenedGroupHero({
  hydrated,
}: OpenedGroupHeroProps) {
  return (
    <Stack sx={openedGroupHeroInnerSx} gap={3}>
      <GroupHeadSecton
        groupName={hydrated.group.name}
        category={hydrated.meta.category_name}
      />
      <GroupDescription hydrated={hydrated} />
      <Divider sx={openedGroupHeroDividerSx} />
    </Stack>
  );
}
