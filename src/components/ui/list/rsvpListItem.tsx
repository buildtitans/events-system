"use client";
import { JSX } from "react";
import type { RsvpSchemaType } from "@/src/schemas/events/rsvpSchema";
import { EventSchemaType } from "@/src/schemas/events/eventSchema";
import { toMonthDayYearHour } from "@/src/lib/utils/parsing/toMonthDayYearHour";
import Stack from "@mui/material/Stack";
import ListItemText from "@mui/material/ListItemText";
import EventRoundedIcon from "@mui/icons-material/EventRounded";
import ListItemIcon from "@mui/material/ListItemIcon";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ListItem from "@mui/material/ListItem";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import EditIcon from '@mui/icons-material/Edit';
import Avatar from "@mui/material/Avatar";

type RsvpListItemProps = {
  rsvp: RsvpSchemaType;
  handleOpenEditStatus: (event_id: EventSchemaType["id"]) => Promise<void>;
  handleNavigateToGroup: (slug: RsvpSchemaType["group_slug"]) => void
};

export default function RsvpListItem({ rsvp, handleOpenEditStatus, handleNavigateToGroup }: RsvpListItemProps): JSX.Element {
  return (
    <ListItem
      component={"li"}
      divider
      sx={{
        bgcolor: "rgba(255, 255, 255, 0.1)",
        borderRadius: 2,
        ":hover": {
          bgcolor: "rgba(255, 255, 255, 0.11)",
        },
        width: "100%"
      }}
    >
    <Stack
    direction={"row"}
    alignItems={"start"}
    justifyContent={"space-between"}
    sx={{
        height: '100%',
        width:  '100%',
    }}
    >
        <ListItemText
        primary={
          <Stack gap={2}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "start",
                gap: 1,
              }}
            >
              <Chip
                clickable
                component={"div"}
                onClick={() => handleNavigateToGroup(rsvp.group_slug)}
                size="small"
                label={rsvp.group_name}
                sx={{ height: "auto", padding: 0.3 }}
                icon={<GroupRoundedIcon sx={{ minWidth: 0 }} />}
              />

              <Typography
              sx={{
                fontSize: {
                  xs: "12px",
                  md: "16px"
                }
              }}
              >{rsvp.event_title}</Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "start",
                gap: 1,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "start",
                  width: "auto",
                  gap: 1,
                }}
              >
                <ListItemIcon sx={{ minWidth: 0 }}>
                  <EventRoundedIcon />
                </ListItemIcon>
                <Typography variant="body2" sx={{ fontWeight: 600, fontSize: {
                    xs: "12px",
                  md: "16px"
                
                } }}>
                  {toMonthDayYearHour(rsvp.starts_at)}
                </Typography>
              </Box>
            </Box>
          </Stack>
        }
      />

     <Box
     sx={{
        width: "auto",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "end",
        gap: {
          xs: 0.5,
          md: 1
        },
     }}
     >
        <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "start",
                  width: "auto",
                  gap: 1,
        cursor: "pointer",

                }}
              >
                <Chip 
                color={(rsvp.attendance_status === "going") ? "success" : "default"}
                label={rsvp.attendance_status}
                variant="filled"
                size="small"
                />
              </Box>

  <Avatar
    component="div"
    onClick={() => handleOpenEditStatus(rsvp.event_id)}
    sx={{
       width: 25,
    height: 25,
      bgcolor: "rgba(255,255,255,0.08)",
      transition: "all 0.2s ease",
      cursor: "pointer",

      '&:hover': {
        bgcolor: "rgba(255,255,255,0.12)",
      },

      '&:hover .edit-icon': {
        color: "white",
      },
    }}
  >
     <EditIcon
    className="edit-icon"
    sx={{
      fontSize: {
        xs: 15,
        md: 18
      },
      color: "rgba(255,255,255,0.4)",
      transition: "color 0.2s ease",
    }}
  />
  </Avatar>
</Box>
    </Stack>

      
     
    </ListItem>
  );
}
