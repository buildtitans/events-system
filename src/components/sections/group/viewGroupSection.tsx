"use client";
import Box from "@mui/material/Box";
import type { JSX } from "react";
import GroupHeadSecton from "./groupHeadSection";
import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import { RenderCurrentView } from "../../pipelines/groups/renderCurrentView";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import useMediaQuery from "@mui/material/useMediaQuery";

type ViewGroupSectionProps = {
  group: GroupSchemaType;
};

export default function ViewGroupSection({
  group,
}: ViewGroupSectionProps): JSX.Element {
  const displayed = useSelector((s: RootState) => s.openGroup.activeSection);
  const xsToLarge = useMediaQuery('min-width(1200px)');

  return (
    <Container
    disableGutters
    id="opened-group-container"
      sx={{
        minHeight: "100vh",
        width: "100%",
      }}
    >
      <Stack
      id="opened-group-stack"
      alignItems={xsToLarge ? "end" : "start"}
        gap={12}
        sx={{
          width: "100%",
          minWidth: "100%",
          minHeight: "70vh",
          height: "100%",
        }}
      >
        <GroupHeadSecton groupName={group.name} />
        {RenderCurrentView(displayed, group)}
      </Stack>
    </Container>
  );
}
