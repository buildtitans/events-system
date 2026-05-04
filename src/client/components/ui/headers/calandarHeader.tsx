import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { JSX } from "react";
import {
  groupCalendarDescriptionSx,
  groupCalendarEyebrowSx,
  groupCalendarHeaderSx,
  groupCalendarTitleSx,
} from "@/src/client/styles/sx/groupCalendar";

export default 
function CalandarHeader(): JSX.Element {

    return (
   <Box sx={groupCalendarHeaderSx}>
            <Typography component="span" sx={groupCalendarEyebrowSx}>
              Schedule
            </Typography>
            <Typography component="h2" sx={groupCalendarTitleSx}>
              Current Schedule
            </Typography>
            <Typography component="p" sx={groupCalendarDescriptionSx}>
              Dates with markers show scheduled or previously held events.
            </Typography>
        </Box>
    )
}
