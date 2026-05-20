"use client";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/src/lib/store";
import {
  CurrentDisplay,
  displaySection,
} from "@/src/lib/store/slices/groups/OpenedGroupSlice";
import type { JSX } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useEffect } from "react";
import Typography from "@mui/material/Typography";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import EventRoundedIcon from "@mui/icons-material/EventRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import {
  getMobileBottomDrawerIconWrapSx,
  getMobileBottomDrawerTabSx,
  mobileBottomDrawerNavSx,
  mobileBottomDrawerSectionLabelSx,
  mobileBottomDrawerTabLabelSx,
  mobileBottomDrawerTabsSx,
} from "@/src/client/styles/sx/mobileBottomDrawer";

const groupOptions = [
  {
    label: "Overview",
    value: "overview",
    icon: <DashboardRoundedIcon fontSize="small" />,
  },
  {
    label: "Events",
    value: "events",
    icon: <EventRoundedIcon fontSize="small" />,
  },
  {
    label: "History",
    value: "group history",
    icon: <HistoryRoundedIcon fontSize="small" />,
  },
] satisfies Array<{
  label: string;
  value: CurrentDisplay;
  icon: JSX.Element;
}>;

export default function MobileGroupNav() {
  const dispatch = useDispatch<AppDispatch>();
  const displayed = useSelector((s: RootState) => s.openGroup.activeSection);

  useEffect(() => {
    return () => {
      dispatch(displaySection("overview"));
    };
  }, [dispatch]);

  return (
    <Box component="nav" sx={mobileBottomDrawerNavSx}>
      <Typography sx={mobileBottomDrawerSectionLabelSx}>Explore</Typography>
      <Box sx={mobileBottomDrawerTabsSx}>
        {groupOptions.map((option) => {
          const active = displayed === option.value;

          return (
          <Button
            key={option.value}
            onClick={() => dispatch(displaySection(option.value))}
            type="button"
            sx={getMobileBottomDrawerTabSx(active)}
          >
            <Box sx={getMobileBottomDrawerIconWrapSx(active)}>
              {option.icon}
            </Box>
            <Typography sx={mobileBottomDrawerTabLabelSx}>
              {option.label}
            </Typography>
          </Button>
          );
        })}
      </Box>
    </Box>
  );
}
