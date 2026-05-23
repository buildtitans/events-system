import { EventDrawerFormState } from "@/src/client/components/ui/drawers/contents/memberAndOrganizerActions";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import HowToRegOutlinedIcon from "@mui/icons-material/HowToRegOutlined";
import EventBusyOutlinedIcon from "@mui/icons-material/EventBusyOutlined";

export function getActionIcon(kind: EventDrawerFormState) {
  switch (kind) {
    case "details":
      return <InfoOutlinedIcon fontSize="small" />;
    case "attendance form":
      return <HowToRegOutlinedIcon fontSize="small" />;
    case "schedule change":
      return <EventBusyOutlinedIcon fontSize="small" />;
  }
}
