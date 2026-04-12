import { JSX } from "react";
import { UserMembershipSchemaType } from "@/src/schemas/groups/userMembershipSchema";
import ListItem from "@mui/material/ListItem";
import Stack from "@mui/material/Stack";
import MembershipListItemHeader from "./content/membershipListItemHeader";
import MembershipListItemBody from "./content/membershipListItemContent";
import { EventSchemaType } from "@/src/schemas/events/eventSchema";
import { toMonthDayYearHour } from "@/src/lib/utils/parsing/toMonthDayYearHour";
import NextWeekIcon from '@mui/icons-material/NextWeek';
import Chip from "@mui/material/Chip";
import EventBusyIcon from '@mui/icons-material/EventBusy';
import { isFutureOrNow } from "@/src/lib/utils/dates/isFutureOrNow";
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';

type MembershipListItemProps = {
  membership: UserMembershipSchemaType;
  handleClick: (slug: UserMembershipSchemaType["group_slug"]) => void,
  nextEvent?: EventSchemaType["starts_at"],

};

export default function MembershipListItem({
  membership,
  nextEvent,
  handleClick
}: MembershipListItemProps): JSX.Element {
  const isCurrent = nextEvent ? isFutureOrNow(new Date(nextEvent)) : undefined



  return (
    <ListItem
      divider
      sx={{
        bgcolor: "rgba(255, 255, 255, 0.1)",
        borderRadius: 2,
        ":hover": {
          bgcolor: "rgba(255, 255, 255, 0.15)",
        },
      }}
    >
    <Stack
    sx={{
      flexDirection: {
        xs: "column",
        md: "row",
      },
    }}
    justifyContent={"space-between"}
    alignItems={"start"}
    width={"100%"}
    >
      <Stack
        gap={1}
        alignItems={"start"}
        justifyContent={"start"}
        sx={{ width: "auto", height: "100%" }}
      >
        <MembershipListItemHeader 
        membership={membership} 
        handleClick={handleClick}
        nextEvent={toMonthDayYearHour(String(nextEvent))}
        />

        <MembershipListItemBody 
        nextEvent={toMonthDayYearHour(String(nextEvent))}
        membership={membership} 
        />

      </Stack>
      <NextGroupEvent isCurrent={isCurrent} nextEvent={nextEvent} />
      
      </Stack> 

    </ListItem>
  );
}

type NextGroupEventProps = {
  nextEvent?: string,
  isCurrent?: boolean
};

function NextGroupEvent({ nextEvent, isCurrent }: NextGroupEventProps): JSX.Element {

  return (
<Stack
      justifyContent={"start"}
      alignItems={"end"}
      sx={{
        height: "100%",
      }}
      >
        {nextEvent ? <Chip 
        color="default"
        variant="filled"
        size="small"
        sx={{
          padding: 1
        }}
        icon={(isCurrent) ?
        (<NextWeekIcon 
          sx={{
      fontSize: 16,
    }}
        color="inherit" 
        />)
        : (
          <WorkHistoryIcon
          sx={{
      fontSize: 16,
    }}
        color="inherit"
          />
        ) 
      } 
        label={nextEvent ? `${toMonthDayYearHour(String(nextEvent))}` : 'Nothing Scheduled'}
        /> 
      : (
        <Chip 
        color="default"
        variant="filled"
        size="small"
        sx={{
          padding: 1
        }}
        icon={<EventBusyIcon sx={{
      fontSize: 16,
    }}
        color="inherit" />}
        label={"No events held yet"}
        />
      )
      }
      </Stack>
  )
}
