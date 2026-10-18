"use client";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/src/lib/store";
import { usePathname, useRouter } from "next/navigation";
import Button from "@mui/material/Button";
import { JSX } from "react";
import { HydratedEventSchemaType } from "@/src/schemas/events/eventSchema";
import { enqueueDrawer } from "@/src/lib/store/slices/rendering/RenderingSlice";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
  openedEventControlsDescriptionSx,
  openedEventControlsSectionSx,
  openedEventControlsTitleSx,
  openedEventPrimaryButtonSx,
  openedEventSectionLabelSx,
} from "@/src/client/styles/sx/openedEventDrawer";

export default function CheckOutGroupButton({
  event,
}: {
  event: HydratedEventSchemaType;
}): JSX.Element | null {
  const path = usePathname();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const handleDirectToGroup = () => {
    router.push(`/${event.meta.event.group_slug}`);
    dispatch(enqueueDrawer(null));
  };

  if (path !== "/") return null;

  return (
    <Box sx={openedEventControlsSectionSx}>
      <Typography component="span" sx={openedEventSectionLabelSx}>
        Group
      </Typography>
      <Typography component="h3" sx={openedEventControlsTitleSx}>
        Explore the community
      </Typography>
      <Typography component="p" sx={openedEventControlsDescriptionSx}>
        Visit the group page to see upcoming events, members, and activity.
      </Typography>
      <Button
        size="medium"
        variant="contained"
        onClick={handleDirectToGroup}
        sx={openedEventPrimaryButtonSx}
      >
        Check out the group
      </Button>
    </Box>
  );
}
