import { JSX } from "react";
import { UserMembershipSchemaType } from "@/src/schemas/groups/userMembershipSchema";
import type { EventSchemaType } from "@/src/schemas/events/eventSchema";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { TitleTypography } from "../../box/cards/group";

type MembershipListItemHeaderProps = {
  membership: UserMembershipSchemaType;
  handleClick: (slug: UserMembershipSchemaType["group_slug"]) => void,
  nextEvent: EventSchemaType["starts_at"]
};

export default function MembershipListItemHeader({
  membership,
  handleClick
}: MembershipListItemHeaderProps): JSX.Element {
  return (
    <Box
      sx={{
        width: "100%",
        height: "auto",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <Stack direction={"row"} gap={4} alignItems={"center"} >
       
        <Box>
          <ListItemText
            sx={{
              cursor: "pointer"
            }}
            primary={
              <Box 
              component={"div"}
              onClick={() => handleClick(membership.group_slug)}
              sx={{ display: "flex", alignItems: "start", justifyContent:"start", gap: 2 }}>
                
                
                <TitleTypography variant="body1" sx={{ fontWeight: 600 }}>
                  {membership.group_name}
                </TitleTypography>
<Chip
                  size="small"
                  variant="filled"
                  label={membership.roleInGroup}
                  sx={{ height: 20 }}
                  color={
                    membership.roleInGroup === "organizer" ? "primary" : "info"
                  }
                />
                
              </Box>
            }
            secondary={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="caption" sx={{ fontWeight: 400 }}>
                    Members: {membership.member_count}
                  
                </Typography>
              </Box>
            }
          ></ListItemText>
        </Box>
      </Stack>

       
    </Box>
  );
}