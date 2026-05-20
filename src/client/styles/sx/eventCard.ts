const eventCardRootSx = {
  position: "relative",
  height: "100%",
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
    inset: "-44% auto auto -18%",
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
  "&:focus-visible": {
    outlineColor: "rgba(124, 198, 255, 0.38)",
  },
};

const eventCardMediaWrapSx = {
  position: "relative",
  height: { sm: "auto", md: "50%" },
  overflow: "hidden",
};

const eventCardMediaSx = {
  height: "100%",
  aspectRatio: { sm: "16 / 9", md: "" },
  transition: "transform 220ms ease, filter 180ms ease",
};

const eventCardMediaOverlaySx = {
  position: "absolute",
  inset: 0,
  background:
    "linear-gradient(180deg, rgba(5, 9, 14, 0.03) 0%, rgba(5, 9, 14, 0.08) 52%, rgba(10, 10, 10, 0.36) 100%)",
  pointerEvents: "none",
};

const eventCardContentSx = {
  position: "relative",
  zIndex: 1,
};

const eventCardGroupLabelSx = {
  color: "rgba(255, 255, 255, 0.78)",
  fontSize: "0.76rem",
  fontWeight: 700,
  letterSpacing: "0.03em",
};

const eventCardTitleSx = {
  color: "#ffffff",
  fontWeight: 700,
  lineHeight: 1.24,
  letterSpacing: "-0.02em",
};

const eventCardDescriptionSx = {
  color: "rgba(255, 255, 255, 0.68)",
  lineHeight: 1.65,
};

const eventCardFooterSx = {
  position: "relative",
  zIndex: 1,
  display: "flex",
  flexDirection: "row",
  gap: 2,
  alignItems: "center",
  justifyContent: "space-between",
  padding: "16px",
  borderTop: "1px solid rgba(255, 255, 255, 0.08)",
  background:
    "linear-gradient(180deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.01) 100%)",
};

const eventCardFooterClusterSx = {
  display: "flex",
  flexDirection: "row",
  gap: 1,
  alignItems: "center",
  minWidth: 0,
  color: "rgba(255, 255, 255, 0.82)",
};

const eventCardFooterTextSx = {
  color: "rgba(255, 255, 255, 0.78)",
  fontWeight: 600,
  maxWidth: "70%",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

const getEventCardFooterIconSx = (accent?: boolean) => ({
  fontSize: "1.15rem",
  color: accent ? "#7cc6ff" : "rgba(255, 255, 255, 0.7)",
});

export {
  eventCardContentSx,
  eventCardDescriptionSx,
  eventCardFooterClusterSx,
  eventCardFooterSx,
  eventCardFooterTextSx,
  eventCardGroupLabelSx,
  eventCardMediaOverlaySx,
  eventCardMediaSx,
  eventCardMediaWrapSx,
  eventCardRootSx,
  eventCardTitleSx,
  getEventCardFooterIconSx,
};
