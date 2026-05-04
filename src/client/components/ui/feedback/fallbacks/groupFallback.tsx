import FadeInOutBox from "@/src/client/components/ui/box/motionboxes/fadeInOutBox";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import WatchLaterRoundedIcon from "@mui/icons-material/WatchLaterRounded";
import {
  noGroupHistoryDescriptionSx,
  noGroupHistoryEyebrowSx,
  noGroupHistoryHintSx,
  noGroupHistoryIconSx,
  noGroupHistoryIconWrapSx,
  noGroupHistoryPanelSx,
  noGroupHistoryRootSx,
  noGroupHistoryTitleSx,
} from "@/src/client/styles/sx/noGroupHistoryFallback";

type OpenedGroupFallbackProps = {
    eyeBrow: "History" | "Events" | "Overview",
    fallbackTitle: 'No events held yet' | 'No events have been scheduled',
    fallbackDescripton: 'This group has not hosted any completed events yet, so there is no activity history to show here.' | "This group has not scheduled any events yet, so there are no events to RSVP to right now.",
    fallbackCaption: "If you want to get in touch with the organizer, their email is listed above."

}

export default function OpenedGroupFallback({
eyeBrow,
fallbackTitle,
fallbackDescripton,
fallbackCaption
}: OpenedGroupFallbackProps) {
  return (
    <FadeInOutBox>
      <Box sx={noGroupHistoryRootSx}>
        <Stack
          justifyContent="center"
          alignItems="center"
          spacing={0}
          sx={noGroupHistoryPanelSx}
        >
          <Box component="header" sx={noGroupHistoryIconWrapSx}>
            <WatchLaterRoundedIcon sx={noGroupHistoryIconSx} />
          </Box>

          <Typography variant="overline" sx={noGroupHistoryEyebrowSx}>
            {eyeBrow}
          </Typography>

          <Typography component="h3" variant="h4" sx={noGroupHistoryTitleSx}>
            {fallbackTitle}
          </Typography>

          <Typography variant="body1" sx={noGroupHistoryDescriptionSx}>
            {fallbackDescripton}
          </Typography>

          <Typography variant="body2" sx={noGroupHistoryHintSx}>
            {fallbackCaption}
          </Typography>
        </Stack>
      </Box>
    </FadeInOutBox>
  );
}
