"use client";
import { JSX } from "react";
import type { RsvpSchemaType } from "@/src/schemas/events/rsvpSchema";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import EventRoundedIcon from "@mui/icons-material/EventRounded";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { toMonthDayYearHour } from "@/src/lib/utils/parsing/toMonthDayYearHour";
import ListItem from "@mui/material/ListItem";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import { EventAttendantsSchemaType } from "@/src/schemas/events/eventAttendantsSchema";

type MyRsvpsProps = {
  rsvps: RsvpSchemaType[];
};

export default function MyRsvps({ rsvps}: MyRsvpsProps): JSX.Element {
  return (
    <Container>
      <Stack
        gap={6}
        divider={<Divider />}
        sx={{
          width: "100%",
        }}
      >
        <Box>
          <Typography
            variant="h4"
            color="primary.info"
            fontWeight={"light"}
            fontSize={"30px"}
          >
            RSVP'd Events
          </Typography>
        </Box>

        <Box>
          <List
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
          >
            {rsvps.map((rsvp) => (
                <RsvpListItem rsvp={rsvp} key={rsvp.event_id} />
            ))}
          </List>
        </Box>
      </Stack>
    </Container>
  );
}

function RsvpListItem({ rsvp }: { rsvp: RsvpSchemaType }): JSX.Element {
  return (
    <ListItem
    divider
      sx={{
      
        bgcolor: "rgba(255, 255, 255, 0.1)",
        borderRadius: 2,
        cursor: "pointer",
        ":hover": {
          bgcolor: "rgba(255, 255, 255, 0.15)",
        },
      }}
    >
      <ListItemText
        primary={
        <Stack 
        gap={2}
        >
                <Box sx={{ 
                    display: "flex", 
                    flexDirection: "column",
                    alignItems: "start", 
                    gap: 1 
                    }}>
          <Chip 
            size="small" 
            label={rsvp.group_name} 
            sx={{ height: "auto", padding: 0.3  }} 
            icon={<GroupRoundedIcon sx={{ minWidth: 0 }} />}
            />

            <Typography>
                {rsvp.event_title}
            </Typography>
          </Box>

          

            
            <Box sx={{ 
                    display: "flex", 
                    flexDirection: "column",
                    alignItems: "start", 
                    gap: 1 
                    }}> 
                                <Box
            sx={{
            display: "flex",
            flexDirection:"row",
            alignItems: "center",
            justifyContent: "start",
            width: "auto",
            gap: 1
          }}
            >
<ListItemIcon sx={{ minWidth: 0 }}>
            <EventRoundedIcon />
          </ListItemIcon>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {toMonthDayYearHour(rsvp.starts_at)}
            </Typography>
            </Box>
<Box
            sx={{
                display: "flex",
            flexDirection:"row",
            alignItems: "center",
            justifyContent: "start",
            width: "auto",
            gap: 1
            }}
            >
            <Typography
                        color="rgba(255, 255, 255, 0.6)"
            >
                My Status:
            </Typography>
<Typography
            color={(rsvp.attendance_status === "going") ? "success" : "textDisabled"}
            >
            {rsvp.attendance_status}
            </Typography>
            </Box>
            
                    
                    </Box>


        </Stack>
        }
      />
        
    </ListItem>
  );
}
