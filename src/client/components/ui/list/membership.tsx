import { JSX } from "react";
import { UserMembershipSchemaType } from "@/src/schemas/groups/userMembershipSchema";
import ListItem from "@mui/material/ListItem";
import Stack from "@mui/material/Stack";
import MembershipListItemHeader from "./content/membershipListItemHeader";
import MembershipListItemBody from "./content/membershipListItemContent";
import { EventSchemaType } from "@/src/schemas/events/eventSchema";
import { toMonthDayYearHour } from "@/src/lib/utils/parsing/toMonthDayYearHour";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import Chip from "@mui/material/Chip";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import { isFutureOrNow } from "@/src/lib/utils/dates/isFutureOrNow";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import Typography from "@mui/material/Typography";
import {
  getMembershipEventChipSx,
  membershipListItemLayoutSx,
  membershipListItemSx,
  membershipNextEventEyebrowSx,
  membershipNextEventWrapSx,
  membershipPrimaryColumnSx,
} from "@/src/client/styles/sx/membershipListItem";

type MembershipListItemProps = {
  membership: UserMembershipSchemaType;
  handleClick: (slug: UserMembershipSchemaType["group_slug"]) => void;
  nextEvent?: EventSchemaType["starts_at"];
};

export default function MembershipListItem({
  membership,
  nextEvent,
  handleClick,
}: MembershipListItemProps): JSX.Element {
  const isCurrent = nextEvent ? isFutureOrNow(new Date(nextEvent)) : undefined;

  return (
    <ListItem disablePadding sx={membershipListItemSx}>
      <Stack sx={membershipListItemLayoutSx}>
        <Stack sx={membershipPrimaryColumnSx}>
          <MembershipListItemHeader
            membership={membership}
            handleClick={handleClick}
          />

          <MembershipListItemBody membership={membership} />
        </Stack>
        <NextGroupEvent isCurrent={isCurrent} nextEvent={nextEvent} />
      </Stack>
    </ListItem>
  );
}

type NextGroupEventProps = {
  nextEvent?: string;
  isCurrent?: boolean;
};

function NextGroupEvent({
  nextEvent,
  isCurrent,
}: NextGroupEventProps): JSX.Element {
  const state = !nextEvent ? "empty" : isCurrent ? "upcoming" : "past";
  const label = !nextEvent
    ? "No events held yet"
    : toMonthDayYearHour(String(nextEvent));
  const eyebrow = !nextEvent
    ? "Schedule"
    : isCurrent
      ? "Next Event"
      : "Most Recent";

  return (
    <Stack sx={membershipNextEventWrapSx}>
      <Typography variant="caption" sx={membershipNextEventEyebrowSx}>
        {eyebrow}
      </Typography>
      <Chip
        variant="filled"
        size="small"
        sx={getMembershipEventChipSx(state)}
        icon={
          state === "upcoming" ? (
            <EventAvailableRoundedIcon fontSize="small" />
          ) : state === "past" ? (
            <HistoryRoundedIcon fontSize="small" />
          ) : (
            <EventBusyIcon fontSize="small" />
          )
        }
        label={label}
      />
    </Stack>
  );
}
