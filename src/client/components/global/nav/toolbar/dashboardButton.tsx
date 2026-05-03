"use client";
import { type JSX } from "react";
import { useRouter } from "next/navigation";
import Button from "@mui/material/Button";
import { navPrimaryButtonSx } from "@/src/styles/sx/nav";
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
      sx={navPrimaryButtonSx}
      type="button"
      variant="contained"
      size="small"
      startIcon={<SpaceDashboardIcon />}
    >
      Dashboard
    </Button>
  );
}
