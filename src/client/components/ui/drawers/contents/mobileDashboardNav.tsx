import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/src/lib/store";
import type { JSX } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { UserAccountViewType } from "@/src/lib/store/slices/user/types";
import { changeAccountTab } from "@/src/lib/store/slices/user/userSlice";
import { useEffect } from "react";
import Typography from "@mui/material/Typography";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import Diversity3RoundedIcon from "@mui/icons-material/Diversity3Rounded";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import { opts } from "@/src/lib/tokens/desktopDashboardOptions";
import {
  getMobileBottomDrawerIconWrapSx,
  getMobileBottomDrawerTabSx,
  mobileBottomDrawerNavSx,
  mobileBottomDrawerSectionLabelSx,
  mobileBottomDrawerTabLabelSx,
  mobileBottomDrawerTabsSx,
} from "@/src/styles/sx/mobileBottomDrawer";

const iconByOption: Record<UserAccountViewType, JSX.Element> = {
  "my groups": <GroupRoundedIcon fontSize="small" />,
  memberships: <Diversity3RoundedIcon fontSize="small" />,
  rsvps: <EventAvailableRoundedIcon fontSize="small" />,
  settings: <GroupRoundedIcon fontSize="small" />,
};

export default function MobileDashboardNav() {
  const dispatch = useDispatch<AppDispatch>();
  const displayed = useSelector((s: RootState) => s.user.view);

  useEffect(() => {
    return () => {
      dispatch(changeAccountTab("my groups"));
    };
  }, [dispatch]);

  return (
    <Box component="nav" sx={mobileBottomDrawerNavSx}>
      <Typography sx={mobileBottomDrawerSectionLabelSx}>Workspace</Typography>
      <Box sx={mobileBottomDrawerTabsSx}>
        {opts.map((option) => {
          const active = displayed === option.value;

          return (
            <Button
              key={option.value}
              onClick={() => dispatch(changeAccountTab(option.value))}
              type="button"
              sx={getMobileBottomDrawerTabSx(active)}
            >
              <Box sx={getMobileBottomDrawerIconWrapSx(active)}>
                {iconByOption[option.value]}
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
