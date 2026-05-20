const mobileBottomDrawerPaperSx = {
  width: "100%",
  px: 1.25,
  pt: 0.9,
  pb: "calc(env(safe-area-inset-bottom, 0px) + 10px)",
  background:
    "linear-gradient(180deg, rgba(10, 10, 10, 0.82) 0%, rgba(8, 8, 8, 0.96) 100%)",
  backdropFilter: "blur(28px)",
  borderTop: "1px solid rgba(255, 255, 255, 0.08)",
  boxShadow: "0 -26px 56px rgba(0, 0, 0, 0.34)",
  overflow: "visible",
};

const mobileBottomDrawerPanelSx = {
  position: "relative",
  width: "100%",
  borderRadius: 4,
  border: "1px solid rgba(255, 255, 255, 0.08)",
  background:
    "linear-gradient(180deg, rgba(22, 22, 22, 0.98) 0%, rgba(14, 14, 14, 0.96) 100%)",
  boxShadow: "0 18px 44px rgba(0, 0, 0, 0.26)",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    inset: "-70% auto auto -12%",
    width: 220,
    height: 220,
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(124, 198, 255, 0.16) 0%, rgba(124, 198, 255, 0) 72%)",
    pointerEvents: "none",
  },
  "&::after": {
    content: '""',
    position: "absolute",
    inset: "auto -10% -120% auto",
    width: 240,
    height: 240,
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0) 74%)",
    pointerEvents: "none",
  },
};

const mobileBottomDrawerInnerSx = {
  position: "relative",
  zIndex: 1,
  display: "flex",
  flexDirection: "column",
  gap: 0.95,
  p: 1,
};

const mobileBottomDrawerHandleSx = {
  alignSelf: "center",
  width: 42,
  height: 4,
  borderRadius: 999,
  backgroundColor: "rgba(255, 255, 255, 0.18)",
  boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.08)",
};

const mobileBottomDrawerNavSx = {
  display: "flex",
  flexDirection: "column",
  gap: 0.9,
};

const mobileBottomDrawerSectionLabelSx = {
  px: 0.5,
  color: "rgba(255, 255, 255, 0.42)",
  fontSize: "0.68rem",
  fontWeight: 700,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
};

const mobileBottomDrawerTabsSx = {
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: 0.75,
};

const getMobileBottomDrawerTabSx = (active: boolean) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 0.55,
  minWidth: 0,
  minHeight: 62,
  px: 0.6,
  py: 0.85,
  borderRadius: 2.75,
  border: "1px solid",
  borderColor: active
    ? "rgba(124, 198, 255, 0.28)"
    : "rgba(255, 255, 255, 0.08)",
  background: active
    ? "linear-gradient(135deg, rgba(124, 198, 255, 0.2) 0%, rgba(96, 162, 255, 0.11) 100%)"
    : "rgba(255, 255, 255, 0.03)",
  color: active ? "#ffffff" : "rgba(255, 255, 255, 0.82)",
  boxShadow: active ? "0 12px 28px rgba(92, 167, 255, 0.18)" : "none",
  textTransform: "none",
  lineHeight: 1.1,
  transition:
    "background-color 180ms ease, border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease",
  "&:hover": {
    backgroundColor: active
      ? "rgba(124, 198, 255, 0.2)"
      : "rgba(255, 255, 255, 0.06)",
    borderColor: active
      ? "rgba(124, 198, 255, 0.34)"
      : "rgba(255, 255, 255, 0.14)",
    transform: "translateY(-1px)",
  },
});

const getMobileBottomDrawerIconWrapSx = (active: boolean) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 30,
  height: 30,
  borderRadius: "50%",
  flexShrink: 0,
  background: active
    ? "linear-gradient(135deg, rgba(126, 204, 255, 0.98) 0%, rgba(96, 162, 255, 0.9) 100%)"
    : "rgba(255, 255, 255, 0.06)",
  color: active ? "#07111d" : "rgba(255, 255, 255, 0.7)",
  boxShadow: active ? "0 10px 24px rgba(92, 167, 255, 0.18)" : "none",
});

const mobileBottomDrawerTabLabelSx = {
  fontSize: "0.79rem",
  fontWeight: 700,
  lineHeight: 1.15,
  textAlign: "center",
  textWrap: "balance",
};

export {
  getMobileBottomDrawerIconWrapSx,
  getMobileBottomDrawerTabSx,
  mobileBottomDrawerHandleSx,
  mobileBottomDrawerInnerSx,
  mobileBottomDrawerNavSx,
  mobileBottomDrawerPanelSx,
  mobileBottomDrawerPaperSx,
  mobileBottomDrawerSectionLabelSx,
  mobileBottomDrawerTabLabelSx,
  mobileBottomDrawerTabsSx,
};
