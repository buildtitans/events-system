const noGroupHistoryRootSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: { xs: 280, md: 360 },
  px: { xs: 1, sm: 2 },
  py: { xs: 2, md: 3 },
  width: "100%",
};

const noGroupHistoryPanelSx = {
  position: "relative",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  width: "100%",
  maxWidth: 620,
  px: { xs: 3, sm: 5 },
  py: { xs: 4, sm: 5 },
  borderRadius: 4,
  border: "1px solid rgba(255, 255, 255, 0.08)",
  background:
    "linear-gradient(180deg, rgba(22, 22, 22, 0.98) 0%, rgba(14, 14, 14, 0.96) 100%)",
  boxShadow: "0 24px 52px rgba(0, 0, 0, 0.2)",
  "&::before": {
    content: '""',
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    background:
      "radial-gradient(circle at top center, rgba(124, 198, 255, 0.1), transparent 38%)",
  },
};

const noGroupHistoryIconWrapSx = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 68,
  height: 68,
  mb: 2,
  borderRadius: "50%",
  border: "1px solid rgba(124, 198, 255, 0.22)",
  background:
    "linear-gradient(180deg, rgba(124, 198, 255, 0.14) 0%, rgba(124, 198, 255, 0.07) 100%)",
  boxShadow: "0 16px 32px rgba(75, 145, 255, 0.14)",
};

const noGroupHistoryIconSx = {
  fontSize: "2rem",
  color: "#7cc6ff",
};

const noGroupHistoryEyebrowSx = {
  mb: 1,
  color: "rgba(124, 198, 255, 0.86)",
  fontSize: "0.78rem",
  fontWeight: 700,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
};

const noGroupHistoryTitleSx = {
  mb: 1.25,
  color: "#ffffff",
  fontWeight: 700,
  letterSpacing: "-0.03em",
};

const noGroupHistoryDescriptionSx = {
  maxWidth: 500,
  mb: 1.25,
  color: "rgba(255, 255, 255, 0.68)",
  lineHeight: 1.7,
};

const noGroupHistoryHintSx = {
  maxWidth: 460,
  color: "rgba(255, 255, 255, 0.52)",
  lineHeight: 1.6,
};

export {
  noGroupHistoryDescriptionSx,
  noGroupHistoryEyebrowSx,
  noGroupHistoryHintSx,
  noGroupHistoryIconSx,
  noGroupHistoryIconWrapSx,
  noGroupHistoryPanelSx,
  noGroupHistoryRootSx,
  noGroupHistoryTitleSx,
};
