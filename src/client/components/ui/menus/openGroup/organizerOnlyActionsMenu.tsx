import type { JSX } from "react";
import type { AppDispatch } from "@/src/lib/store";
import { useDispatch } from "react-redux";
import { enqueueDrawer } from "@/src/lib/store/slices/rendering/RenderingSlice";
import { displaySection } from "@/src/lib/store/slices/groups/OpenedGroupSlice";
import {
  groupSidebarActionCardSx,
  groupSidebarActionDescriptionSx,
  groupSidebarActionTitleSx,
  groupSidebarPrimaryButtonSx,
  groupSidebarSecondaryButtonSx,
} from "@/src/client/styles/sx/groupSidebar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import ArchiveIcon from '@mui/icons-material/Archive';
import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import { useHydrateGroupArchives } from "@/src/lib/hooks/hydration/group/useHydrateGroupArchives";

export default function OrganizerOnlyActionsMenu({ group_id }: { group_id: GroupSchemaType["id"]}): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const { hydrateArchivedEvents } = useHydrateGroupArchives(group_id);

  const handleOpenDrawer = () => {
    dispatch(enqueueDrawer("create event drawer"));
  };

  const handleDisplayArchives = async () => {
  dispatch(displaySection("archives"))
   await hydrateArchivedEvents()
  };

  return (
    <Box sx={groupSidebarActionCardSx}>
      <Typography sx={groupSidebarActionTitleSx}>Organizer Tools</Typography>
      <Typography sx={groupSidebarActionDescriptionSx}>
        Create new events and keep your community schedule moving.
      </Typography>
      <Button
        onClick={handleOpenDrawer}
        startIcon={<EventAvailableRoundedIcon />}
        sx={groupSidebarPrimaryButtonSx}
      >
        Create Event
      </Button>
      <Button
        onClick={handleDisplayArchives}
        startIcon={<ArchiveIcon />}
        sx={groupSidebarSecondaryButtonSx}
      >
        View Archives
      </Button>
    </Box>
  );
}
