"use client";
import Box from "@mui/material/Box";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import { type JSX } from "react";
import Typography from "@mui/material/Typography";
import {
  GroupSlug,
  NameOfGroup,
} from "@/src/lib/store/slices/events/EventDrawerSlice";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/src/lib/store";
import { enqueueDrawer } from "@/src/lib/store/slices/rendering/RenderingSlice";
import {
  openedEventGroupLinkSx,
  openedEventGroupNameSx,
} from "@/src/client/styles/sx/openedEventDrawer";

type GroupNameProps = {
  slug: GroupSlug;
  name: NameOfGroup;
};

export default function GroupName({ slug, name }: GroupNameProps): JSX.Element | null {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  if (slug.status !== "ready" || name.status !== "ready") return null;

  const openGroupBySlug = () => {
    const route = `/group/${slug.data}`;
    router.push(route);
    dispatch(enqueueDrawer(null));
  };

  return (
    <Box
      onClick={openGroupBySlug}
      component="div"
      sx={openedEventGroupLinkSx}
    >
      <Typography gutterBottom variant="body2" sx={openedEventGroupNameSx}>
        {name.data}
      </Typography>
      <OpenInNewRoundedIcon sx={{ fontSize: "1rem" }} />
    </Box>
  );
}
