"use client";
import Box from "@mui/material/Box";
import { JSX } from "react";
import FadeInOutBox from "@/src/client/components/ui/box/motionboxes/fadeInOutBox";
import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import { AnimatePresence } from "framer-motion";
import GroupEventsHeader from "./groupEventsHeader";
import { openedGroupHeroHeaderWrapSx } from "@/src/client/styles/sx/openedGroupHero";

type GroupHeadSectionProps = {
  groupName: GroupSchemaType["name"];
};

export default function GroupHeadSecton(
  { groupName }: GroupHeadSectionProps,
): JSX.Element | null {
  return (
    <AnimatePresence>
      {groupName && (
        <FadeInOutBox styles={{ width: "100%", height: "auto" }}>
          <Box sx={openedGroupHeroHeaderWrapSx}>
            <GroupEventsHeader groupName={groupName} />
          </Box>
        </FadeInOutBox>
      )}
    </AnimatePresence>
  );
}
