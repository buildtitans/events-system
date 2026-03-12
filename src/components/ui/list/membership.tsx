import ListItem from "@mui/material/ListItem";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { JSX } from "react";
import Stack from "@mui/material/Stack";

type MembershipType = {
  location: string;
  group_id: string;
  group_name: string;
  group_slug: string;
  member_count: number;
  roleInGroup: "anonymous" | "member" | "organizer";
};

type MembershipListItemProps = {
  membership: MembershipType;
};

export default function MembershipListItem({
  membership,
}: MembershipListItemProps): JSX.Element {
  return (
    <ListItem
      divider
      sx={{
        width: "40%",
        bgcolor: "rgba(255, 255, 255, 0.1)",
        borderRadius: 999,
        cursor: "pointer",
        ":hover": {
          bgcolor: "rgba(255, 255, 255, 0.15)",
        },
      }}
    >
      <Stack direction={"row"} gap={4} alignItems={"center"}>
        <ListItemIcon sx={{ minWidth: 0 }}>
          <GroupRoundedIcon fontSize="medium" />
        </ListItemIcon>

        <Box>
          <ListItemText
            primary={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {membership.group_name}
                </Typography>

                <Chip
                  size="small"
                  label={membership.location}
                  sx={{ height: 20 }}
                />
              </Box>
            }
          ></ListItemText>
          
        </Box>
      </Stack>
    </ListItem>
  );
}
