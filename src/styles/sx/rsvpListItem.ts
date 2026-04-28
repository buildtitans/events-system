import type { EventAttendantStatusSchemaType } from "@/src/schemas/events/eventAttendantsSchema";

const rsvpListItemSx = {
  position: "relative",
  width: "100%",
  px: { xs: 2, md: 2.5 },
  py: { xs: 2, md: 2.25 },
  borderRadius: 3.5,
  border: "1px solid rgba(255, 255, 255, 0.08)",
  background:
    "linear-gradient(180deg, rgba(24, 24, 24, 0.98) 0%, rgba(15, 15, 15, 0.96) 100%)",
  boxShadow: "0 16px 38px rgba(0, 0, 0, 0.18)",
  overflow: "hidden",
  transition:
    "transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease",
  "&::before": {
    content: '""',
    position: "absolute",
    inset: "-42% auto auto -16%",
    width: 180,
    height: 180,
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(124, 198, 255, 0.12) 0%, rgba(124, 198, 255, 0) 72%)",
    pointerEvents: "none",
  },
  "&:hover": {
    borderColor: "rgba(124, 198, 255, 0.2)",
    boxShadow: "0 20px 44px rgba(0, 0, 0, 0.24)",
  },
};

const rsvpListItemLayoutSx = {
  position: "relative",
  zIndex: 1,
  display: "flex",
  flexDirection: { xs: "column", md: "row" },
  justifyContent: "space-between",
  alignItems: { xs: "flex-start", md: "stretch" },
  gap: { xs: 2, md: 3 },
  width: "100%",
};

const rsvpPrimaryColumnSx = {
  display: "flex",
  flexDirection: "column",
  gap: 1.3,
  flex: 1,
  minWidth: 0,
};

const rsvpTopRowSx = {
  display: "flex",
  alignItems: "center",
  gap: 0.85,
  flexWrap: "wrap",
};

const rsvpGroupChipSx = {
  height: 28,
  borderRadius: 999,
  border: "1px solid rgba(255, 255, 255, 0.08)",
  background: "rgba(255, 255, 255, 0.04)",
  color: "rgba(255, 255, 255, 0.86)",
  "& .MuiChip-label": {
    px: 1.2,
    fontWeight: 700,
  },
  "& .MuiChip-icon": {
    color: "rgba(255, 255, 255, 0.7)",
  },
};

const rsvpScheduledChipSx = {
  height: 28,
  borderRadius: 999,
  border: "1px solid rgba(255, 189, 89, 0.22)",
  background: "rgba(255, 189, 89, 0.1)",
  color: "#ffd58d",
  "& .MuiChip-label": {
    px: 1.2,
    fontWeight: 700,
  },
  "& .MuiChip-icon": {
    color: "#ffd58d",
  },
};

const rsvpEventTitleSx = {
  color: "#ffffff",
  fontWeight: 700,
  lineHeight: 1.25,
  letterSpacing: "-0.02em",
  fontSize: { xs: "1.05rem", md: "1.15rem" },
};

const rsvpMetaRowSx = {
  display: "flex",
  flexWrap: "wrap",
  gap: 0.75,
};

const getRsvpMetaChipSx = (accent?: boolean) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 0.65,
  minHeight: 30,
  px: 1,
  py: 0.45,
  borderRadius: 999,
  border: "1px solid",
  borderColor: accent
    ? "rgba(124, 198, 255, 0.22)"
    : "rgba(255, 255, 255, 0.08)",
  backgroundColor: accent
    ? "rgba(124, 198, 255, 0.1)"
    : "rgba(255, 255, 255, 0.03)",
  color: accent ? "#cfe7ff" : "rgba(255, 255, 255, 0.74)",
});

const getRsvpMetaIconSx = (accent?: boolean) => ({
  fontSize: "0.98rem",
  color: accent ? "#7cc6ff" : "rgba(255, 255, 255, 0.58)",
});

const rsvpActionsWrapSx = {
  display: "flex",
  flexDirection: "column",
  alignItems: { xs: "flex-start", md: "flex-end" },
  justifyContent: "flex-start",
  gap: 0.75,
  minWidth: { xs: "100%", md: "fit-content" },
};

const rsvpActionLabelSx = {
  color: "rgba(255, 255, 255, 0.4)",
  fontSize: "0.68rem",
  fontWeight: 700,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
};

const rsvpActionsRowSx = {
  display: "flex",
  alignItems: "center",
  gap: 0.85,
  flexWrap: "wrap",
  justifyContent: { xs: "flex-start", md: "flex-end" },
};

const getRsvpAttendanceChipSx = (status: EventAttendantStatusSchemaType) => ({
  height: 32,
  borderRadius: 999,
  border: "1px solid",
  borderColor:
    status === "going"
      ? "rgba(107, 214, 120, 0.28)"
      : status === "interested"
        ? "rgba(124, 198, 255, 0.24)"
        : "rgba(255, 255, 255, 0.08)",
  background:
    status === "going"
      ? "linear-gradient(135deg, rgba(107, 214, 120, 0.18) 0%, rgba(58, 171, 92, 0.12) 100%)"
      : status === "interested"
        ? "linear-gradient(135deg, rgba(124, 198, 255, 0.16) 0%, rgba(96, 162, 255, 0.1) 100%)"
        : "rgba(255, 255, 255, 0.05)",
  color:
    status === "going"
      ? "#c7f7cc"
      : status === "interested"
        ? "#d8edff"
        : "rgba(255, 255, 255, 0.78)",
  textTransform: "capitalize",
  "& .MuiChip-label": {
    px: 1.2,
    fontWeight: 700,
  },
});

const rsvpEditButtonSx = {
  width: 34,
  height: 34,
  borderRadius: "50%",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  backgroundColor: "rgba(255, 255, 255, 0.04)",
  color: "rgba(255, 255, 255, 0.68)",
  transition: "all 180ms ease",
  "&:hover": {
    backgroundColor: "rgba(124, 198, 255, 0.12)",
    borderColor: "rgba(124, 198, 255, 0.2)",
    color: "#d6ebff",
  },
};

export {
  getRsvpAttendanceChipSx,
  getRsvpMetaChipSx,
  getRsvpMetaIconSx,
  rsvpActionLabelSx,
  rsvpActionsRowSx,
  rsvpActionsWrapSx,
  rsvpEditButtonSx,
  rsvpEventTitleSx,
  rsvpGroupChipSx,
  rsvpListItemLayoutSx,
  rsvpListItemSx,
  rsvpMetaRowSx,
  rsvpPrimaryColumnSx,
  rsvpScheduledChipSx,
  rsvpTopRowSx,
};
