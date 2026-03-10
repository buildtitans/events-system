"use client";
import type { JSX } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import Skeleton from "@mui/material/Skeleton";
import CurrentUser from "@/src/components/global/nav/toolbar/accountAvatar";

export default function RenderCurrentUser(): JSX.Element | null {
  const email = useSelector((s: RootState) => s.user.email);

  console.log(email)

  switch (email.status) {
    case "pending": {
      return (
        <Skeleton 
        variant="rounded" 
        animation="wave"
        sx={{ width: "100%", height: "auto" }} 
        />
      );
    }

    case "ready": {
      return <CurrentUser email={email.data} />;
    }

    default: {
      return null;
    }
  }
}