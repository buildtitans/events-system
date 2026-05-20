"use client";
import HydrateUserAccountPage from "@/src/client/components/hydration/HydrateUserAccountPage";
import UserAccount from "@/src/client/components/pages/userAccountPage";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { JSX } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/src/lib/store";
import { getDesktopSidebarOffsetSx } from "@/src/client/styles/sx/sidebar";

export default function UserPage(): JSX.Element {
  const sidebar = useSelector((s: RootState) => s.rendering.sidebar);
  const showDesktopSidebar = sidebar === "user";

  return (
    <Container
      maxWidth={false}
      component={"main"}
      sx={{
        height: "100%",
        ...getDesktopSidebarOffsetSx(showDesktopSidebar),
      }}
    >
      <HydrateUserAccountPage />
      <Box sx={{ width: "100%", height: "100%" }}>
        <UserAccount />
      </Box>
    </Container>
  );
}
