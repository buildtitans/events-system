"use client";
import Box from "@mui/material/Box";
import { JSX } from "react";
import FadeInOutBox from "@/src/client/components/ui/box/motionboxes/fadeInOutBox";
import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import { AnimatePresence } from "framer-motion";
import GroupPanelEyebrow from "./groupPanelHead";
import { openedGroupHeroHeaderWrapSx } from "@/src/client/styles/sx/openedGroupHero";
import { CategorySchemaType } from "@/src/schemas/groups/categoriesSchema";

type GroupHeadSectionProps = {
  groupName: GroupSchemaType["name"];
  category: CategorySchemaType["name"];
};

export default function GroupHeadSecton({
  groupName,
  category,
}: GroupHeadSectionProps): JSX.Element | null {
  return (
    <AnimatePresence>
      {groupName && (
        <FadeInOutBox styles={{ width: "100%", height: "auto" }}>
          <Box sx={openedGroupHeroHeaderWrapSx}>
            <GroupPanelEyebrow groupName={groupName} category={category} />
          </Box>
        </FadeInOutBox>
      )}
    </AnimatePresence>
  );
}
