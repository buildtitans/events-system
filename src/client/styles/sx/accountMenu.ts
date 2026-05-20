const accountMenuRootSx = {
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
  px: 1,
  pt: "88px",
  pb: 1,
};

const accountMenuPanelSx = {
  position: "relative",
  display: "flex",
  flexDirection: "column",
  gap: 1.25,
  width: "100%",
  minHeight: "100%",
  p: 1,
  borderRadius: 4,
  border: "1px solid rgba(255, 255, 255, 0.08)",
  background:
    "linear-gradient(180deg, rgba(22, 22, 22, 0.98) 0%, rgba(14, 14, 14, 0.96) 100%)",
  boxShadow: "0 18px 40px rgba(0, 0, 0, 0.24)",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    inset: "-20% auto auto -35%",
    width: 180,
    height: 180,
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(124, 198, 255, 0.16) 0%, rgba(124, 198, 255, 0) 74%)",
    pointerEvents: "none",
  },
};

const accountMenuHeaderSx = {
  position: "relative",
  zIndex: 1,
  width: "100%",
  p: 1.25,
  borderRadius: 3,
  border: "1px solid rgba(255, 255, 255, 0.06)",
  backgroundColor: "rgba(255, 255, 255, 0.03)",
  boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.04)",
};

const accountMenuAvatarSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 34,
  height: 34,
  borderRadius: "50%",
  flexShrink: 0,
  border: "1px solid rgba(124, 198, 255, 0.26)",
  background:
    "linear-gradient(135deg, rgba(126, 204, 255, 0.98) 0%, rgba(96, 162, 255, 0.9) 100%)",
  boxShadow: "0 12px 28px rgba(92, 167, 255, 0.2)",
  color: "#07111d",
};

const accountMenuSectionLabelSx = {
  px: 1,
  pt: 0.25,
  color: "rgba(255, 255, 255, 0.42)",
  fontSize: "0.68rem",
  fontWeight: 700,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
};

const accountMenuNavSx = {
  position: "relative",
  zIndex: 1,
  width: "100%",
  p: 0.75,
  borderRadius: 3,
  border: "1px solid rgba(255, 255, 255, 0.06)",
  backgroundColor: "rgba(255, 255, 255, 0.02)",
};

const accountMenuListSx = {
  p: 0,
  display: "flex",
  flexDirection: "column",
  gap: 0.5,
};

const getAccountMenuItemSx = (active: boolean) => ({
  alignItems: "center",
  borderRadius: 2.5,
  px: 1,
  py: 0.85,
  minHeight: 52,
  gap: 1,
  border: "1px solid",
  borderColor: active
    ? "rgba(124, 198, 255, 0.26)"
    : "rgba(255, 255, 255, 0.02)",
  background: active
    ? "linear-gradient(135deg, rgba(124, 198, 255, 0.2) 0%, rgba(96, 162, 255, 0.1) 100%)"
    : "transparent",
  color: active ? "#ffffff" : "rgba(255, 255, 255, 0.78)",
  transition: "all 180ms ease",
  "&:hover": {
    backgroundColor: active
      ? "rgba(124, 198, 255, 0.2)"
      : "rgba(255, 255, 255, 0.05)",
    borderColor: active
      ? "rgba(124, 198, 255, 0.32)"
      : "rgba(255, 255, 255, 0.08)",
  },
  "&.Mui-selected": {
    background:
      "linear-gradient(135deg, rgba(124, 198, 255, 0.2) 0%, rgba(96, 162, 255, 0.1) 100%)",
  },
  "&.Mui-selected:hover": {
    backgroundColor: "rgba(124, 198, 255, 0.2)",
  },
});

const getAccountMenuIconSx = (active: boolean) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 32,
  height: 32,
  borderRadius: "50%",
  flexShrink: 0,
  background: active
    ? "linear-gradient(135deg, rgba(126, 204, 255, 0.98) 0%, rgba(96, 162, 255, 0.9) 100%)"
    : "rgba(255, 255, 255, 0.06)",
  color: active ? "#07111d" : "rgba(255, 255, 255, 0.7)",
  boxShadow: active ? "0 10px 24px rgba(92, 167, 255, 0.18)" : "none",
});

const accountMenuFooterSx = {
  position: "relative",
  zIndex: 1,
  mt: "auto",
  p: 1.25,
  borderRadius: 3,
  border: "1px solid rgba(255, 255, 255, 0.06)",
  backgroundColor: "rgba(255, 255, 255, 0.02)",
};

export {
  accountMenuAvatarSx,
  accountMenuFooterSx,
  accountMenuHeaderSx,
  getAccountMenuIconSx,
  getAccountMenuItemSx,
  accountMenuListSx,
  accountMenuNavSx,
  accountMenuPanelSx,
  accountMenuRootSx,
  accountMenuSectionLabelSx,
};
