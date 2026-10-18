import { JSX } from "react";
import { UserMembershipSurfaceSchemaType } from "@/src/schemas/groups/userMembershipSchema";
import ListItem from "@mui/material/ListItem";
import Stack from "@mui/material/Stack";
import MembershipListItemHeader from "./membershipListItemHeader";
import MembershipListItemBody from "./membershipListItemContent";
import { toMonthDayYearHour } from "@/src/lib/utils/parsing/toMonthDayYearHour";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import Chip from "@mui/material/Chip";
import EventBusyOutlinedIcon from "@mui/icons-material/EventBusyOutlined";
import EventBusyIcon from "@mui/icons-material/EventBusy";
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
import { assertNever } from "@/src/lib/utils/assert/assertNever";

type MembershipListItemProps = {
  membership: UserMembershipSurfaceSchemaType;
  handleClick: (
    slug: UserMembershipSurfaceSchemaType["membership"]["group_slug"],
  ) => void;
};

export default function MembershipListItem({
  membership,
  handleClick,
}: MembershipListItemProps): JSX.Element {
  return (
    <ListItem disablePadding sx={membershipListItemSx}>
      <Stack sx={membershipListItemLayoutSx}>
        <Stack sx={membershipPrimaryColumnSx}>
          <MembershipListItemHeader
            membership={membership.membership}
            meta={membership.meta}
            handleClick={handleClick}
          />

          <MembershipListItemBody membership={membership.membership} />
        </Stack>
        <NextGroupEvent schedule={membership.meta.schedule} />
      </Stack>
    </ListItem>
  );
}

type NextGroupEventProps = {
  schedule: UserMembershipSurfaceSchemaType["meta"]["schedule"];
};

function NextGroupEvent({ schedule }: NextGroupEventProps): JSX.Element {
  switch (schedule.timeline_status) {
    case "no_events": {
      return (
        <Stack sx={membershipNextEventWrapSx}>
          <Typography variant="caption" sx={membershipNextEventEyebrowSx}>
            {"No Activity"}
          </Typography>
          <Chip
            variant="filled"
            size="small"
            sx={getMembershipEventChipSx("empty")}
            icon={<EventBusyOutlinedIcon fontSize="small" />}
            label={"No Activity"}
          />
        </Stack>
      );
    }
    case "past_only": {
      return (
        <Stack sx={membershipNextEventWrapSx}>
          <Typography variant="caption" sx={membershipNextEventEyebrowSx}>
            {"Most Recent"}
          </Typography>
          <Chip
            variant="filled"
            size="small"
            sx={getMembershipEventChipSx("past")}
            icon={<HistoryRoundedIcon fontSize="small" />}
            label={toMonthDayYearHour(schedule.last_event_held)}
          />
        </Stack>
      );
    }
    case "today_only": {
      return (
        <Stack sx={membershipNextEventWrapSx}>
          <Typography variant="caption" sx={membershipNextEventEyebrowSx}>
            {"Happening Today"}
          </Typography>
          <Chip
            variant="filled"
            size="small"
            sx={getMembershipEventChipSx("upcoming")}
            icon={<EventBusyIcon fontSize="small" />}
            label={toMonthDayYearHour(schedule.todays_event)}
          />
        </Stack>
      );
    }
    case "upcoming": {
      return (
        <Stack sx={membershipNextEventWrapSx}>
          <Typography variant="caption" sx={membershipNextEventEyebrowSx}>
            {"Next Event"}
          </Typography>
          <Chip
            variant="filled"
            size="small"
            sx={getMembershipEventChipSx("upcoming")}
            icon={<EventAvailableRoundedIcon fontSize="small" />}
            label={toMonthDayYearHour(schedule.next_event_scheduled)}
          />
        </Stack>
      );
    }

    default: {
      return assertNever(schedule);
    }
  }
}
