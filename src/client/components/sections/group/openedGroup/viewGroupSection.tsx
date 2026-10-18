"use client";
import { type JSX } from "react";
import type { GroupHydratedSchemaType } from "@/src/schemas/groups/groupSchema";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import Stack from "@mui/material/Stack";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useHydrateGroupHistory } from "@/src/lib/hooks/hydration/group/useHydrateGroupHistory";
import { useTheme } from "@mui/material/styles";
import OpenedGroupPanel from "@/src/client/components/sections/group/openedGroup/displays/openedGroupPanel";

type ViewGroupSectionProps = {
  hydrated: GroupHydratedSchemaType;
};

export default function ViewGroupSection({
  hydrated,
}: ViewGroupSectionProps): JSX.Element {
  const theme = useTheme();
  const lgScreen = useMediaQuery(theme.breakpoints.up("lg"));
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const displayed = useSelector((s: RootState) => s.openGroup.activeSection);
  useHydrateGroupHistory();

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
        hydrated={hydrated}
      />
    </Stack>
  );
}
