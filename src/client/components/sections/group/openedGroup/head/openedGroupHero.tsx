import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import { Divider, Stack } from "@mui/material";
import GroupHeadSecton from "./groupHeadSection";
import GroupDescription from "./groupDescription";
import {
  openedGroupHeroDividerSx,
  openedGroupHeroInnerSx,
} from "@/src/client/styles/sx/openedGroupHero";
import { CategorySchemaType } from "@/src/schemas/groups/categoriesSchema";

type OpenedGroupHeroProps = {
  group: GroupSchemaType;
  category: CategorySchemaType["name"];
};

export default function OpenedGroupHero({
  group,
  category,
}: OpenedGroupHeroProps) {
  return (
    <Stack sx={openedGroupHeroInnerSx} gap={3}>
      <GroupHeadSecton groupName={group.name} category={category} />
      <GroupDescription group={group} />
      <Divider sx={openedGroupHeroDividerSx} />
    </Stack>
  );
}
