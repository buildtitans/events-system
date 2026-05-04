"use client";
import type { JSX } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/src/lib/store";
import type { UserAccountViewType } from "@/src/lib/store/slices/user/types";
import { changeAccountTab } from "@/src/lib/store/slices/user/userSlice";
import Box from "@mui/material/Box";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import { opts } from "@/src/lib/tokens/desktopDashboardOptions";
import Typography from "@mui/material/Typography";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import Diversity3RoundedIcon from "@mui/icons-material/Diversity3Rounded";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import Stack from "@mui/material/Stack";
import {
  accountMenuListSx,
  accountMenuNavSx,
  accountMenuSectionLabelSx,
  getAccountMenuIconSx,
  getAccountMenuItemSx,
} from "@/src/client/styles/sx/accountMenu";

const iconByOption: Record<UserAccountViewType, JSX.Element> = {
  "my groups": <GroupRoundedIcon fontSize="small" />,
  memberships: <Diversity3RoundedIcon fontSize="small" />,
  rsvps: <EventAvailableRoundedIcon fontSize="small" />,
  settings: <GroupRoundedIcon fontSize="small" />,
};

export default function DesktopDashboardMenuButtons(): JSX.Element {
  const displayed = useSelector((s: RootState) => s.user.view);
  const dispatch = useDispatch<AppDispatch>();

  const handleSelect = (option: UserAccountViewType) => {
    dispatch(changeAccountTab(option));
  };

  return (
    <Box component={"nav"} sx={accountMenuNavSx}>
      <Typography sx={accountMenuSectionLabelSx}>Workspace</Typography>
      <MenuList variant="menu" sx={accountMenuListSx}>
        {opts.map((option) => {
          const active = displayed === option.value;

          return (
            <MenuItem
              selected={active}
              onClick={() => handleSelect(option.value)}
              key={option.value}
              value={option.value}
              sx={getAccountMenuItemSx(active)}
            >
              <Box sx={getAccountMenuIconSx(active)}>
                {iconByOption[option.value]}
              </Box>
              <Stack spacing={0.15}>
                <Typography
                  sx={{
                    color: active ? "#ffffff" : "rgba(255, 255, 255, 0.86)",
                    fontWeight: 700,
                    lineHeight: 1.2,
                  }}
                >
                  {option.label}
                </Typography>
              </Stack>
            </MenuItem>
          );
        })}
      </MenuList>
    </Box>
  );
}
