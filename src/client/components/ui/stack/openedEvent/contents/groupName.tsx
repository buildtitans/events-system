"use client";
import Box from "@mui/material/Box";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import { type JSX } from "react";
import Typography from "@mui/material/Typography";

import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/src/lib/store";
import { enqueueDrawer } from "@/src/lib/store/slices/rendering/RenderingSlice";
import {
  openedEventGroupLinkSx,
  openedEventGroupNameSx,
} from "@/src/client/styles/sx/openedEventDrawer";
import { HydratedEventSchemaType } from "@/src/schemas/events/eventSchema";

type GroupNameProps = {
  slug: HydratedEventSchemaType["meta"]["event"]["group_slug"];
  name: HydratedEventSchemaType["meta"]["event"]["group_name"];
};

export default function GroupName({
  slug,
  name,
}: GroupNameProps): JSX.Element | null {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const openGroupBySlug = () => {
    const route = `/group/${slug}`;
    router.push(route);
    dispatch(enqueueDrawer(null));
  };

  return (
    <Box onClick={openGroupBySlug} component="div" sx={openedEventGroupLinkSx}>
      <Typography gutterBottom variant="body2" sx={openedEventGroupNameSx}>
        {name}
      </Typography>
      <OpenInNewRoundedIcon sx={{ fontSize: "1rem" }} />
    </Box>
  );
}
