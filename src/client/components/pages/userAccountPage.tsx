"use client";
import { JSX, useEffect } from "react";
import Stack from "@mui/material/Stack";
import { useHydrateMyRsvps } from "@/src/lib/hooks/hydration/user/useHydrateMyRSVPs";
import DashboardPanel from "../sections/user/dashboardPanel";
import { useDetectActiveSession } from "@/src/lib/hooks/auth/session/useDetectActiveSession";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/src/lib/store";
import { enqueueSidebar } from "@/src/lib/store/slices/rendering/RenderingSlice";

export default function UserAccount(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  useHydrateMyRsvps();
  useDetectActiveSession();

  useEffect(() => {
    return () => {
      dispatch(enqueueSidebar(null));
    };
  }, [dispatch]);

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
  );
}
