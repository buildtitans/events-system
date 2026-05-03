import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { JSX } from "react";
import {
  groupCalendarDescriptionSx,
  groupCalendarEyebrowSx,
  groupCalendarHeaderSx,
  groupCalendarTitleSx,
} from "@/src/styles/sx/groupCalendar";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import type { CurrentDisplay } from "@/src/lib/store/slices/groups/OpenedGroupSlice";

type HeaderInfo = { 
    title: string,
    header: string,
    caption: string;
}

type CurrentDisplayedHeader = Record<CurrentDisplay, HeaderInfo>;



const displayHeaders = {
  events: {
    title: "Schedule",
    header: "Current Schedule",
    caption: "Dates with markers show scheduled or previously held events.",
  },
  overview: {
    title: "Overview",
    header: "Community Snapshot",
    caption: "See the group’s details, who runs it, and what activity is coming up.",
  },
  "group history": {
    title: "History",
    header: "Past Activity",
    caption: "Review previously held events and how many people attended each one.",
  },
} satisfies CurrentDisplayedHeader;


function getDisplayedHeader(displayed: CurrentDisplay) {

    return displayHeaders[displayed];
};

export default 
function ActiveDisplayHeader(): JSX.Element {
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
              Dates with markers show scheduled or previously held events.
            </Typography>
        </Box>
    )
}
