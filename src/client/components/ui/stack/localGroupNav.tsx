import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useEffect, type JSX } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/src/lib/store";
import {
  CurrentDisplay,
  displaySection,
} from "@/src/lib/store/slices/groups/OpenedGroupSlice";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import EventRoundedIcon from "@mui/icons-material/EventRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import {
  getGroupSidebarIconSx,
  getGroupSidebarItemSx,
  groupSidebarListSx,
  groupSidebarNavSx,
  groupSidebarSectionLabelMap,
  groupSidebarSectionLabelSx,
} from "@/src/client/styles/sx/groupSidebar";

const options = [
  {
    value: "overview",
    label: groupSidebarSectionLabelMap.overview,
    icon: <DashboardRoundedIcon fontSize="small" />,
  },
  {
    value: "events",
    label: groupSidebarSectionLabelMap.events,
    icon: <EventRoundedIcon fontSize="small" />,
  },
  {
    value: "group history",
    label: groupSidebarSectionLabelMap["group history"],
    icon: <HistoryRoundedIcon fontSize="small" />,
  },
] satisfies Array<{
  value: CurrentDisplay;
  label: string;
  icon: JSX.Element;
}>;

export default function LocalGroupNav(): JSX.Element {
  const displayed = useSelector((s: RootState) => s.openGroup.activeSection);
  const dispatch = useDispatch<AppDispatch>();

  const handleClick = (option: CurrentDisplay) => {
    dispatch(displaySection(option));
  };

  useEffect(() => {
    return () => {
      dispatch(displaySection("overview"));
    };
  }, [dispatch]);

  return (
    <Box component="nav" sx={groupSidebarNavSx}>
      <Typography sx={groupSidebarSectionLabelSx}>Navigate</Typography>
      <MenuList variant="menu" sx={groupSidebarListSx}>
        {options.map((option) => {
          const active = displayed === option.value;

          return (
            <MenuItem
              selected={active}
              onClick={() => handleClick(option.value)}
              key={option.value}
              value={option.value}
              sx={getGroupSidebarItemSx(active)}
            >
              <Box sx={getGroupSidebarIconSx(active)}>{option.icon}</Box>
              <Typography
                sx={{
                  color: active ? "#ffffff" : "rgba(255, 255, 255, 0.86)",
                  fontWeight: 700,
                  lineHeight: 1.2,
                }}
              >
                {option.label}
              </Typography>
            </MenuItem>
          );
        })}
      </MenuList>
    </Box>
  );
}
