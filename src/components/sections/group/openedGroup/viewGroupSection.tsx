"use client";
import type { JSX } from "react";
import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import RenderCurrentView from "@/src/components/pipelines/groups/renderCurrentView";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import Stack from "@mui/material/Stack";
import useMediaQuery from "@mui/material/useMediaQuery";
import Divider from "@mui/material/Divider";
import { useHydrateGroupHisory } from "@/src/lib/hooks/hydration/useHydrateGroupHistory";
import { useTheme } from "@mui/material/styles";
import OpenedGroupHero from "./head/openedGroupHero";

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
      >
        <Stack
          gap={4}
          sx={{
            width: "100%",
            height: "100%",
          }}
        >
          <OpenedGroupHero group={group} />

          <RenderCurrentView view={displayed} isMobile={isMobile} />
        </Stack>
      </Stack>
  );
}
