"use client";
import { type JSX } from "react";
import { useRouter } from "next/navigation";
import Button from "@mui/material/Button";
import { navActionsButtonSx } from "@/src/styles/sx/sx";
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';


export default function DashboardButton(): JSX.Element {
  const router = useRouter();

  const handleClick = () => {
    const route = "/user";
    router.push(route);
  };


  return (
    <Button
      onClick={handleClick}
      sx={navActionsButtonSx}
      type="button"
     color="info"
          variant="contained"
          size="small"
          startIcon={<SpaceDashboardIcon />}
    >
            Dashboard
    </Button>
  );
}
