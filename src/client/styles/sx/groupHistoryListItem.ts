const groupHistoryListItemSx = {
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

const groupHistoryItemLayoutSx = {
  position: "relative",
  zIndex: 1,
  display: "flex",
  flexDirection: { xs: "column", md: "row" },
  justifyContent: "space-between",
  alignItems: { xs: "flex-start", md: "stretch" },
  gap: { xs: 2, md: 3 },
  width: "100%",
};

const groupHistoryPrimaryColumnSx = {
  display: "flex",
  flexDirection: "column",
  gap: 1.3,
  flex: 1,
  minWidth: 0,
};

const groupHistoryTopRowSx = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: 1.25,
  width: "100%",
};

const groupHistoryTitleWrapSx = {
  minWidth: 0,
  flex: 1,
};

const groupHistoryTitleSx = {
  color: "#ffffff",
  fontWeight: 700,
  lineHeight: 1.22,
  letterSpacing: "-0.02em",
  fontSize: { xs: "1.02rem", md: "1.16rem" },
};

const groupHistoryDescriptionSx = {
  color: "rgba(255, 255, 255, 0.68)",
  lineHeight: 1.72,
  fontSize: { xs: "0.96rem", md: "1rem" },
};

const groupHistoryMetaRowSx = {
  display: "flex",
  flexWrap: "wrap",
  gap: 0.75,
};

const getGroupHistoryMetaChipSx = (accent?: boolean) => ({
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

const getGroupHistoryMetaIconSx = (accent?: boolean) => ({
  fontSize: "0.98rem",
  color: accent ? "#7cc6ff" : "rgba(255, 255, 255, 0.58)",
});

const groupHistoryActionsWrapSx = {
  display: "flex",
  flexDirection: "column",
  alignItems: { xs: "flex-start", md: "flex-end" },
  justifyContent: "space-between",
  gap: 1,
  minWidth: { xs: "100%", md: "fit-content" },
};

const groupHistoryAttendanceLabelSx = {
  color: "rgba(255, 255, 255, 0.4)",
  fontSize: "0.68rem",
  fontWeight: 700,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
};

const groupHistoryAttendanceTextSx = {
  color: "rgba(255, 255, 255, 0.76)",
  fontSize: { xs: "0.9rem", md: "0.95rem" },
  fontWeight: 600,
  lineHeight: 1.5,
  textAlign: { xs: "left", md: "right" },
};

const getGroupHistoryStatusChipSx = (state: "upcoming" | "past") => ({
  height: 30,
  borderRadius: 999,
  border: "1px solid",
  borderColor:
    state === "upcoming"
      ? "rgba(124, 198, 255, 0.24)"
      : "rgba(255, 189, 89, 0.22)",
  background:
    state === "upcoming"
      ? "linear-gradient(135deg, rgba(124, 198, 255, 0.16) 0%, rgba(96, 162, 255, 0.1) 100%)"
      : "linear-gradient(135deg, rgba(255, 189, 89, 0.16) 0%, rgba(255, 162, 0, 0.12) 100%)",
  color: state === "upcoming" ? "#d8edff" : "#ffd58d",
  "& .MuiChip-label": {
    px: 1.15,
    fontWeight: 700,
  },
  "& .MuiChip-icon": {
    ml: 0.85,
    color: state === "upcoming" ? "#7cc6ff" : "#ffbd59",
  },
});

export {
  getGroupHistoryMetaChipSx,
  getGroupHistoryMetaIconSx,
  getGroupHistoryStatusChipSx,
  groupHistoryActionsWrapSx,
  groupHistoryAttendanceLabelSx,
  groupHistoryAttendanceTextSx,
  groupHistoryDescriptionSx,
  groupHistoryItemLayoutSx,
  groupHistoryListItemSx,
  groupHistoryMetaRowSx,
  groupHistoryPrimaryColumnSx,
  groupHistoryTitleSx,
  groupHistoryTitleWrapSx,
  groupHistoryTopRowSx,
};
