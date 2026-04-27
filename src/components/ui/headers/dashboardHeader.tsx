import { UserAccountViewType } from "@/src/lib/store/slices/user/types";
import { Box, Typography, Button, Stack, Divider } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { type JSX } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/src/lib/store";
import { enqueueDrawer } from "@/src/lib/store/slices/rendering/RenderingSlice";
import {
  dashboardHeaderActionButtonSx,
  dashboardHeaderActionWrapSx,
  dashboardHeaderDescriptionSx,
  dashboardHeaderDividerSx,
  dashboardHeaderEyebrowSx,
  dashboardHeaderInnerSx,
  dashboardHeaderPanelSx,
  dashboardHeaderRootSx,
  dashboardHeaderTitleSx,
  dashboardHeaderTitleWrapSx,
} from "@/src/styles/sx/dashboardHeader";

type DashboardHeaderContent = {
  description: string;
  eyebrow: string;
  title: string;
};

const dashboardHeaderContent: Record<UserAccountViewType, DashboardHeaderContent> = {
  memberships: {
    eyebrow: "Community",
    title: "Memberships",
    description:
      "Keep up with the groups you follow and see what they are planning next.",
  },
  "my groups": {
    eyebrow: "Workspace",
    title: "My Groups",
    description:
      "Manage the communities you have created and jump back into the ones you lead.",
  },
  rsvps: {
    eyebrow: "Plans",
    title: "RSVP'd Events",
    description:
      "Track the events you have saved and revisit your upcoming schedule.",
  },
  settings: {
    eyebrow: "Account",
    title: "Settings",
    description: "Review the preferences and details tied to your account.",
  },
};

export default function DashboardHeader(): JSX.Element {
  const view = useSelector((s: RootState) => s.user.view);
  const dispatch = useDispatch<AppDispatch>();
  const content = dashboardHeaderContent[view];

  return (
   
          <Stack
            direction={{ xs: "column", md: "row" }}
            alignItems={{ xs: "flex-start", md: "center" }}
            justifyContent="space-between"
            gap={{ xs: 2.5, md: 3 }}
          >
            <Box sx={dashboardHeaderTitleWrapSx}>
              <Typography variant="overline" sx={dashboardHeaderEyebrowSx}>
                {content.eyebrow}
              </Typography>
              <Typography variant="h3" sx={dashboardHeaderTitleSx}>
                {content.title}
              </Typography>
              <Typography variant="body1" sx={dashboardHeaderDescriptionSx}>
                {content.description}
              </Typography>
            </Box>
            {view === "my groups" && (
              <Box sx={dashboardHeaderActionWrapSx}>
                <Button
                  suppressHydrationWarning={true}
                  onClick={() => dispatch(enqueueDrawer("new group"))}
                  variant="contained"
                  size="small"
                  startIcon={<AddIcon />}
                  sx={dashboardHeaderActionButtonSx}
                >
                  Create Group
                </Button>
              </Box>
            )}
          </Stack>
  );
}
