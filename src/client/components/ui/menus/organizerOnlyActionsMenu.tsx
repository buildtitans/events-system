import type { JSX } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/src/lib/store";
import { enqueueDrawer } from "@/src/lib/store/slices/rendering/RenderingSlice";
import {
  groupSidebarActionCardSx,
  groupSidebarActionDescriptionSx,
  groupSidebarActionTitleSx,
  groupSidebarPrimaryButtonSx,
} from "@/src/client/styles/sx/groupSidebar";

export default function OrganizerOnlyActionsMenu(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();

  const handleOpenDrawer = () => {
    dispatch(enqueueDrawer("create event drawer"));
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
    </Box>
  );
}
