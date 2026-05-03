"use client";
import type { JSX } from "react";
import Box from "@mui/material/Box";
import AccountDetailsHeader from "../../sections/user/userAccountMenuHeader";
import DesktopDashboardMenuButtons from "./desktopDashboardMenuButtons";
import UserAccountMenuFooter from "../../sections/user/userAccountMenuFooter";
import {
  accountMenuPanelSx,
  accountMenuRootSx,
} from "@/src/styles/sx/accountMenu";

export default function UserAccountMenu({ email }: { email: string}): JSX.Element {

  return (
    <Box sx={accountMenuRootSx}>
      <Box sx={accountMenuPanelSx}>
        <AccountDetailsHeader email={email} />
        <DesktopDashboardMenuButtons />
        <UserAccountMenuFooter />
      </Box>
    </Box>
  );
}
