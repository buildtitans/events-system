"use client";
import { JSX } from "react";
import Stack from "@mui/material/Stack";
import { useHydrateMyRsvps } from "@/src/lib/hooks/hydration/useHydrateMyRSVPs";
import DashboardPanel from "../sections/user/dashboardPanel";
import { useDetectActiveSession } from "@/src/lib/hooks/auth/useDetectActiveSession";

export default function UserAccount(): JSX.Element {
  useHydrateMyRsvps();
  useDetectActiveSession();

    return (
         <Stack
        alignItems={"center"}
        sx={{
          minHeight: "100svh",
          width: "100%",
          minWidth: "100%",
        }}
      >
        <DashboardPanel />
        
      </Stack>
    )
}