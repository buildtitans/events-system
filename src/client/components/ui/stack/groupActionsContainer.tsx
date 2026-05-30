"use client";
import { JSX } from "react";
import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import LocalGroupNav from "./localGroupNav";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";
import { RenderRoleBasedSidebarContents } from "../../pipelines/drawers/forks/renderRoleBasedSidebarContents";
import {
  getGroupSidebarMetaChipSx,
  getGroupSidebarMetaIconSx,
  groupSidebarActionsSx,
  groupSidebarHeaderBadgeSx,
  groupSidebarHeaderSx,
  groupSidebarMetaRowSx,
  groupSidebarPanelSx,
  groupSidebarRoleLabelMap,
  groupSidebarRootSx,
  groupSidebarSectionLabelSx,
  groupSidebarTitleSx,
} from "@/src/client/styles/sx/groupSidebar";

type GroupActonsContainerProps = {
  group_id: GroupSchemaType["id"];
};

export default function GroupActonsContainer({
  group_id,
}: GroupActonsContainerProps): JSX.Element | null {
  const role = useSelector((s: RootState) => s.viewer.viewerRole);
  const group = useSelector((s: RootState) => s.openGroup.group);

  if (group.status !== "ready") {
    return null;
  }

  return (
    <Box sx={groupSidebarRootSx}>
      <Box sx={groupSidebarPanelSx}>
        <Box sx={groupSidebarHeaderSx}>
          <Stack direction="row" spacing={1.25} alignItems="center">
            <Box sx={groupSidebarHeaderBadgeSx}>
              <GroupsRoundedIcon fontSize="small" />
            </Box>
            <Stack spacing={0.35} minWidth={0}>
              <Typography sx={groupSidebarSectionLabelSx}>Community</Typography>
              <Typography variant="body1" sx={groupSidebarTitleSx}>
                {group.data.name}
              </Typography>
            </Stack>
          </Stack>

          <Stack direction="row" sx={{ ...groupSidebarMetaRowSx, mt: 1.25 }}>
            <Box sx={getGroupSidebarMetaChipSx(true)}>
              <ShieldRoundedIcon sx={getGroupSidebarMetaIconSx(true)} />
              <Typography variant="caption" sx={{ fontWeight: 700 }}>
                {groupSidebarRoleLabelMap[role]}
              </Typography>
            </Box>
            {group.data.location && (
              <Box sx={getGroupSidebarMetaChipSx()}>
                <PlaceRoundedIcon sx={getGroupSidebarMetaIconSx()} />
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  {group.data.location}
                </Typography>
              </Box>
            )}
          </Stack>
        </Box>

        <LocalGroupNav />

        <Box sx={groupSidebarActionsSx}>
          <Typography sx={groupSidebarSectionLabelSx}>Actions</Typography>
          <Box sx={{ px: 0.75, pt: 0.75 }}>
            <RenderRoleBasedSidebarContents role={role} group_id={group_id} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
