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

export default function NoGroupHistory() {
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
            History
          </Typography>

          <Typography component="h3" variant="h4" sx={noGroupHistoryTitleSx}>
            No past events yet
          </Typography>

          <Typography variant="body1" sx={noGroupHistoryDescriptionSx}>
            This group has not hosted any completed events yet, so there is no
            activity history to show here.
          </Typography>

          <Typography variant="body2" sx={noGroupHistoryHintSx}>
            Once events are held, this space will track what happened and how
            many people attended.
          </Typography>
        </Stack>
      </Box>
    </FadeInOutBox>
  );
}
