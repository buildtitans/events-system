const footerRootSx = {
  mt: { xs: 8, md: 10 },
  borderTop: "1px solid rgba(255, 255, 255, 0.06)",
  background:
    "linear-gradient(180deg, rgba(13, 13, 13, 0) 0%, rgba(10, 10, 10, 0.96) 14%, rgba(10, 10, 10, 1) 100%)",
};

const footerContainerSx = {
  py: { xs: 5, sm: 6, md: 7 },
};

const footerSurfaceSx = {
  position: "relative",
  overflow: "hidden",
  px: { xs: 3, sm: 4, md: 5 },
  py: { xs: 4, sm: 4.5, md: 5 },
  borderRadius: 4,
  border: "1px solid rgba(255, 255, 255, 0.08)",
  background:
    "linear-gradient(180deg, rgba(22, 22, 22, 0.96) 0%, rgba(14, 14, 14, 0.94) 100%)",
  boxShadow: "0 24px 48px rgba(0, 0, 0, 0.2)",
  "&::before": {
    content: '""',
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    background:
      "radial-gradient(circle at top right, rgba(124, 198, 255, 0.12), transparent 34%)",
    opacity: 0.9,
  },
};

const footerTopGridSx = {
  display: "grid",
  gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1fr) auto" },
  gap: { xs: 3, md: 4 },
  alignItems: "start",
};

const footerEyebrowSx = {
  display: "inline-flex",
  alignItems: "center",
  color: "rgba(124, 198, 255, 0.86)",
  fontSize: "0.78rem",
  fontWeight: 700,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
};

const footerTitleSx = {
  color: "#ffffff",
  fontWeight: 700,
  letterSpacing: "-0.03em",
};

const footerDescriptionSx = {
  maxWidth: 540,
  color: "rgba(255, 255, 255, 0.66)",
  lineHeight: 1.7,
};

const footerLinkLabelSx = {
  color: "rgba(255, 255, 255, 0.54)",
  fontSize: "0.78rem",
  fontWeight: 700,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
};

const footerLinksWrapSx = {
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: 1.25,
  justifyContent: { xs: "flex-start", md: "flex-end" },
};

const footerLinkSx = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 46,
  height: 46,
  borderRadius: "50%",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  backgroundColor: "rgba(255, 255, 255, 0.03)",
  color: "rgba(255, 255, 255, 0.86)",
  transition:
    "transform 180ms ease, border-color 180ms ease, color 180ms ease, background-color 180ms ease, box-shadow 180ms ease",
  "&:hover": {
    transform: "translateY(-2px)",
    borderColor: "rgba(124, 198, 255, 0.28)",
    backgroundColor: "rgba(124, 198, 255, 0.08)",
    color: "#7cc6ff",
    boxShadow: "0 14px 28px rgba(75, 145, 255, 0.16)",
  },
};

const footerBottomRowSx = {
  display: "flex",
  flexDirection: { xs: "column", sm: "row" },
  justifyContent: "space-between",
  alignItems: { xs: "flex-start", sm: "center" },
  gap: 1.5,
  pt: 3,
  borderTop: "1px solid rgba(255, 255, 255, 0.08)",
};

const footerCopyrightSx = {
  color: "rgba(255, 255, 255, 0.72)",
  fontWeight: 600,
};

const footerBottomNoteSx = {
  color: "rgba(255, 255, 255, 0.5)",
};

export {
  footerBottomNoteSx,
  footerBottomRowSx,
  footerContainerSx,
  footerCopyrightSx,
  footerDescriptionSx,
  footerEyebrowSx,
  footerLinkLabelSx,
  footerLinkSx,
  footerLinksWrapSx,
  footerRootSx,
  footerSurfaceSx,
  footerTitleSx,
  footerTopGridSx,
};
