import type { JSX } from "react";
import {
  groupCalendarDescriptionSx,
  groupCalendarEyebrowSx,
  groupCalendarHeaderSx,
  groupCalendarTitleSx,
} from "@/src/client/styles/sx/groupCalendar";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import { getDisplayedHeader } from "@/src/lib/tokens/openedGroupHeaderTokens";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function ActiveDisplayHeader(): JSX.Element {
  const displayed = useSelector((s: RootState) => s.openGroup.activeSection);
  const headerInfo = getDisplayedHeader(displayed);

  return (
    <Box sx={groupCalendarHeaderSx}>
      <Typography component="span" sx={groupCalendarEyebrowSx}>
        {headerInfo.title}
      </Typography>
      <Typography component="h2" sx={groupCalendarTitleSx}>
        {headerInfo.header}
      </Typography>
      <Typography component="p" sx={groupCalendarDescriptionSx}>
        {headerInfo.caption}
      </Typography>
    </Box>
  );
}
