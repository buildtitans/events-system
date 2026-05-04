"use client";
import Button from "@mui/material/Button";
import { useDispatch } from "react-redux";
import { enqueueDrawer } from "@/src/lib/store/slices/rendering/RenderingSlice";
import { AppDispatch } from "@/src/lib/store";
import { UserKind } from "@/src/lib/store/slices/auth/AuthSlice";
import type { JSX } from "react";
import Notifications from "../menus/notifications/notifications";
import Box from "@mui/material/Box";
import {
  navActionsContainerSx,
  navActionsGroupSx,
  navPrimaryButtonSx,
  navSecondaryButtonSx,
} from "@/src/client/styles/sx/nav";
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardButton from "./dashboardButton";

export type NavActionsProps = {
  userKind: UserKind;
  openSignupDrawer: () => void;
  showSignoutModal: () => void;
};

export default function NavActions({
  userKind,
  openSignupDrawer,
  showSignoutModal,
}: NavActionsProps): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <Box sx={navActionsContainerSx}>
      <Box sx={navActionsGroupSx}>
        {userKind === "anonymous" && (
          <Button
            suppressHydrationWarning={true}
            onClick={() => dispatch(enqueueDrawer("sign in drawer"))}
            variant="contained"
            size="small"
            sx={navSecondaryButtonSx}
          >
            Sign in
          </Button>
        )}

        {userKind === "anonymous" && (
          <Button
            suppressHydrationWarning={true}
            onClick={openSignupDrawer}
            variant="contained"
            size="small"
            sx={navPrimaryButtonSx}
          >
            Sign up
          </Button>
        )}

        {userKind === "authenticated" && (
          <Button
            suppressHydrationWarning={true}
            sx={navSecondaryButtonSx}
            onClick={showSignoutModal}
            variant="contained"
            size="small"
            startIcon={<LogoutIcon />}
          >
            Sign out
          </Button>
        )}
      </Box>

      {userKind === "authenticated" && (
        <Box sx={navActionsGroupSx}>
          <Notifications key={"notifications-badge"} />
          <DashboardButton />
        </Box>
      )}
    </Box>
  );
}
