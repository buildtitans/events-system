import { JSX } from "react";
import { UserMembershipSchemaType } from "@/src/schemas/groups/userMembershipSchema";
import ListItem from "@mui/material/ListItem";
import Stack from "@mui/material/Stack";
import MembershipListItemHeader from "./content/membershipListItemHeader";
import MembershipListItemBody from "./content/membershipListItemContent";
import { EventSchemaType } from "@/src/schemas/events/eventSchema";
import { toMonthDayYearHour } from "@/src/lib/utils/parsing/toMonthDayYearHour";

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
        gap={1}
        justifyContent={"space-between"}
        alignItems={"start"}
        sx={{ width: "100%" }}
      >
        <MembershipListItemHeader 
        membership={membership} 
        handleClick={handleClick}
        />

        <MembershipListItemBody 
        nextEvent={toMonthDayYearHour(String(nextEvent))}
        membership={membership} 
        />

      </Stack>
    </ListItem>
  );
}

