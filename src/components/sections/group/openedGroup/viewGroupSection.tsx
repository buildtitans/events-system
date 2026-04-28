"use client";
import type { JSX } from "react";
import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import Stack from "@mui/material/Stack";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useHydrateGroupHisory } from "@/src/lib/hooks/hydration/useHydrateGroupHistory";
import { useTheme } from "@mui/material/styles";
import OpenedGroupPanel from "@/src/components/sections/group/openedGroup/openedGroupPanel";

type ViewGroupSectionProps = {
  group: GroupSchemaType;
};

export default function ViewGroupSection({
  group,
}: ViewGroupSectionProps): JSX.Element {
  const theme = useTheme();
  const lgScreen = useMediaQuery(theme.breakpoints.up("lg"));
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const displayed = useSelector((s: RootState) => s.openGroup.activeSection);
  useHydrateGroupHisory();

  return (
      <Stack
        id="opened-group-stack"
        alignItems={lgScreen ? "start" : "center"}
        justifyContent={"start"}
        sx={{
          width: "100%",
          minHeight: "70vh",
          height: "100%",
        }}

      gap={4}
      >
        <OpenedGroupPanel 
        displayed={displayed}
        isMobile={isMobile}
        group={group}
        />
      </Stack>
  );
}
