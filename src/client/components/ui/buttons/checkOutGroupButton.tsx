"use client";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/src/lib/store";
import { usePathname, useRouter } from "next/navigation";
import Button from "@mui/material/Button";
import { JSX, useMemo } from "react";
import { EventSchemaType } from "@/src/schemas/events/eventSchema";
import { getGroupSlugRoute } from "@/src/lib/utils/parsing/getGroupSlugRoute";
import { enqueueDrawer } from "@/src/lib/store/slices/rendering/RenderingSlice";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
  openedEventControlsDescriptionSx,
  openedEventControlsSectionSx,
  openedEventControlsTitleSx,
  openedEventPrimaryButtonSx,
  openedEventSectionLabelSx,
} from "@/src/styles/sx/openedEventDrawer";

export default function CheckOutGroupButton({ event }: { event: EventSchemaType | null }): JSX.Element | null {
    const path = usePathname();
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const groups = useSelector((s: RootState) => s.groups.communities);
    const route = useMemo(() => getGroupSlugRoute(groups, event),
        [event, groups]);

    const handleDirectToGroup = () => {
        router.push(route);
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
    )
}
