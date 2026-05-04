const noGroupsFallbackRootSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: { xs: 320, md: 420 },
  px: { xs: 2, sm: 3 },
  py: { xs: 2, md: 3 },
};

const noGroupsFallbackPanelSx = {
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
      "radial-gradient(circle at top center, rgba(124, 198, 255, 0.14), transparent 38%)",
  },
};

const noGroupsFallbackIconWrapSx = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 68,
  height: 68,
  mb: 2,
  borderRadius: "50%",
  border: "1px solid rgba(124, 198, 255, 0.24)",
  background:
    "linear-gradient(180deg, rgba(124, 198, 255, 0.16) 0%, rgba(124, 198, 255, 0.08) 100%)",
  boxShadow: "0 16px 32px rgba(75, 145, 255, 0.16)",
};

const noGroupsFallbackIconSx = {
  fontSize: "2rem",
  color: "#7cc6ff",
};

const noGroupsFallbackEyebrowSx = {
  mb: 1,
  color: "rgba(124, 198, 255, 0.86)",
  fontSize: "0.78rem",
  fontWeight: 700,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
};

const noGroupsFallbackTitleSx = {
  mb: 1.25,
  color: "#ffffff",
  fontWeight: 700,
  letterSpacing: "-0.03em",
};

const noGroupsFallbackDescriptionSx = {
  maxWidth: 480,
  mb: 2.5,
  color: "rgba(255, 255, 255, 0.68)",
  lineHeight: 1.7,
};

const noGroupsFallbackHintSx = {
  maxWidth: 440,
  color: "rgba(255, 255, 255, 0.52)",
  lineHeight: 1.6,
};

const noGroupsFallbackActionWrapSx = {
  mt: 1,
  mb: 1.5,
};

const noGroupsFallbackActionButtonSx = {
  minHeight: 48,
  px: 2.4,
  borderRadius: 999,
  border: "1px solid rgba(124, 198, 255, 0.28)",
  background:
    "linear-gradient(135deg, rgba(124, 198, 255, 0.94) 0%, rgba(90, 157, 255, 0.84) 100%)",
  boxShadow: "0 18px 36px rgba(75, 145, 255, 0.22)",
  color: "#0d1117",
  fontWeight: 700,
  letterSpacing: "0.02em",
  textTransform: "uppercase",
  "&:hover": {
    background:
      "linear-gradient(135deg, rgba(138, 206, 255, 0.96) 0%, rgba(108, 169, 255, 0.88) 100%)",
    boxShadow: "0 20px 40px rgba(75, 145, 255, 0.26)",
  },
};

export {
  noGroupsFallbackActionButtonSx,
  noGroupsFallbackActionWrapSx,
  noGroupsFallbackDescriptionSx,
  noGroupsFallbackEyebrowSx,
  noGroupsFallbackHintSx,
  noGroupsFallbackIconSx,
  noGroupsFallbackIconWrapSx,
  noGroupsFallbackPanelSx,
  noGroupsFallbackRootSx,
  noGroupsFallbackTitleSx,
};
