const dashboardHeaderRootSx = {
  width: "100%",
  pt: { xs: 2, md: 3 },
  pb: { xs: 3, md: 4 },
};

export const dashboardRootSx = {
  width: "100%",
  pt: { xs: 2, md: 3 },
  pb: { xs: 3, md: 4 },
};

export const dashboardPanelSx = {
  position: "relative",
  width: "100%",
  borderRadius: 4,
  border: "1px solid rgba(255, 255, 255, 0.08)",
  background:
    "linear-gradient(180deg, rgba(22, 22, 22, 0.98) 0%, rgba(14, 14, 14, 0.96) 100%)",
  boxShadow: "0 18px 48px rgba(0, 0, 0, 0.22)",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    inset: "-25% auto auto -6%",
    width: 240,
    height: 240,
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(124, 198, 255, 0.14) 0%, rgba(124, 198, 255, 0) 72%)",
    pointerEvents: "none",
  },
  "&::after": {
    content: '""',
    position: "absolute",
    inset: "auto -8% -70% auto",
    width: 260,
    height: 260,
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0) 72%)",
    pointerEvents: "none",
  },
};

const dashboardHeaderPanelSx = {
  position: "relative",
  width: "100%",
  borderRadius: 4,
  border: "1px solid rgba(255, 255, 255, 0.08)",
  background:
    "linear-gradient(180deg, rgba(22, 22, 22, 0.98) 0%, rgba(14, 14, 14, 0.96) 100%)",
  boxShadow: "0 18px 48px rgba(0, 0, 0, 0.22)",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    inset: "-25% auto auto -6%",
    width: 240,
    height: 240,
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(124, 198, 255, 0.14) 0%, rgba(124, 198, 255, 0) 72%)",
    pointerEvents: "none",
  },
  "&::after": {
    content: '""',
    position: "absolute",
    inset: "auto -8% -70% auto",
    width: 260,
    height: 260,
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0) 72%)",
    pointerEvents: "none",
  },
};

const dashboardHeaderInnerSx = {
  position: "relative",
  zIndex: 1,
  px: { xs: 2.5, md: 4 },
  py: { xs: 2.5, md: 3.25 },
};

const dashboardHeaderTitleWrapSx = {
  maxWidth: { xs: "100%", md: 720 },
};

const dashboardHeaderEyebrowSx = {
  display: "block",
  mb: 1,
  color: "rgba(124, 198, 255, 0.82)",
  fontWeight: 700,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
};

const dashboardHeaderTitleSx = {
  mb: 1,
  color: "#ffffff",
  fontWeight: 700,
  letterSpacing: "-0.03em",
  lineHeight: 1.02,
  fontSize: { xs: "2rem", md: "2.35rem" },
};

const dashboardHeaderDescriptionSx = {
  maxWidth: { xs: "100%", md: "58ch" },
  color: "rgba(255, 255, 255, 0.68)",
  fontSize: { xs: "0.98rem", md: "1.02rem" },
  lineHeight: 1.7,
};

const dashboardHeaderActionWrapSx = {
  minWidth: "fit-content",
  alignSelf: { xs: "flex-start", md: "center" },
};

const dashboardHeaderActionButtonSx = {
  minWidth: "fit-content",
  height: 42,
  px: 2,
  borderRadius: 999,
  border: "1px solid rgba(124, 198, 255, 0.28)",
  background:
    "linear-gradient(135deg, rgba(126, 204, 255, 0.98) 0%, rgba(96, 162, 255, 0.92) 100%)",
  color: "#07111d",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  fontWeight: 800,
  textWrap: "nowrap",
  boxShadow: "0 14px 32px rgba(92, 167, 255, 0.22)",
  "& .MuiButton-startIcon": {
    color: "#07111d",
  },
  "&:hover": {
    background:
      "linear-gradient(135deg, rgba(141, 211, 255, 1) 0%, rgba(108, 172, 255, 0.94) 100%)",
    boxShadow: "0 18px 40px rgba(92, 167, 255, 0.28)",
  },
};

const dashboardHeaderDividerSx = {
  mt: { xs: 2.5, md: 3 },
  borderColor: "rgba(255, 255, 255, 0.08)",
};

export {
  dashboardHeaderActionButtonSx,
  dashboardHeaderActionWrapSx,
  dashboardHeaderDescriptionSx,
  dashboardHeaderDividerSx,
  dashboardHeaderEyebrowSx,
  dashboardHeaderInnerSx,
  dashboardHeaderPanelSx,
  dashboardHeaderRootSx,
  dashboardHeaderTitleSx,
  dashboardHeaderTitleWrapSx,
};
