const navSurfaceSx = {
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: { xs: 1.25, md: 2 },
  width: "100%",
  px: { xs: 1, md: 1.25 },
  py: 1,
  borderRadius: 999,
  border: "1px solid rgba(255, 255, 255, 0.08)",
  background:
    "linear-gradient(180deg, rgba(22, 22, 22, 0.96) 0%, rgba(13, 13, 13, 0.92) 100%)",
  backdropFilter: "blur(24px)",
  boxShadow: "0 18px 48px rgba(0, 0, 0, 0.24)",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    inset: "0 auto auto 10%",
    width: 220,
    height: 220,
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(124, 198, 255, 0.14) 0%, rgba(124, 198, 255, 0) 72%)",
    pointerEvents: "none",
  },
  "&::after": {
    content: '""',
    position: "absolute",
    inset: "auto -8% -180% auto",
    width: 280,
    height: 280,
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0) 70%)",
    pointerEvents: "none",
  },
};

const navBarClusterSx = {
  position: "relative",
  zIndex: 1,
  display: "flex",
  alignItems: "center",
  gap: 1,
  flex: 1,
  minWidth: 0,
};

const navActionsContainerSx = {
  position: "relative",
  zIndex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: 1,
  flexShrink: 0,
  minWidth: "fit-content",
};

const navActionsGroupSx = {
  display: "flex",
  alignItems: "center",
  gap: 1,
};

const navHomeButtonSx = {
  minWidth: "fit-content",
  height: 40,
  px: 1.6,
  borderRadius: 999,
  border: "1px solid rgba(255, 255, 255, 0.08)",
  backgroundColor: "rgba(255, 255, 255, 0.08)",
  color: "#ffffff",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  fontWeight: 700,
  textWrap: "nowrap",
  boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.04)",
  "& .MuiButton-startIcon": {
    color: "#7cc6ff",
  },
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    borderColor: "rgba(255, 255, 255, 0.14)",
  },
};

const navSecondaryButtonSx = {
  minWidth: "fit-content",
  height: 40,
  px: 1.75,
  borderRadius: 999,
  border: "1px solid rgba(255, 255, 255, 0.08)",
  backgroundColor: "rgba(255, 255, 255, 0.04)",
  color: "#ffffff",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  fontWeight: 700,
  textWrap: "nowrap",
  boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.04)",
  "& .MuiButton-startIcon": {
    color: "rgba(255, 255, 255, 0.7)",
  },
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderColor: "rgba(255, 255, 255, 0.14)",
  },
};

const navPrimaryButtonSx = {
  minWidth: "fit-content",
  height: 40,
  px: 1.9,
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

const navIconButtonSx = {
  width: 40,
  height: 40,
  borderRadius: "50%",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  backgroundColor: "rgba(255, 255, 255, 0.04)",
  color: "#ffffff",
  boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.04)",
  transition: "all 180ms ease",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderColor: "rgba(255, 255, 255, 0.14)",
  },
};

const navBadgeSx = {
  "& .MuiBadge-badge": {
    minWidth: 18,
    height: 18,
    px: 0.5,
    borderRadius: 999,
    border: "1px solid rgba(124, 198, 255, 0.24)",
    backgroundColor: "#7cc6ff",
    color: "#07111d",
    fontWeight: 800,
    boxShadow: "0 8px 24px rgba(92, 167, 255, 0.22)",
  },
};

const navSearchAutocompleteSx = {
  flex: 1,
  minWidth: 0,
  maxWidth: { xs: "100%", md: 440 },
  "& .MuiAutocomplete-endAdornment .MuiButtonBase-root": {
    color: "rgba(255, 255, 255, 0.52)",
  },
};

const navSearchInputSx = {
  width: "100%",
  height: 44,
  borderRadius: 999,
  color: "rgba(255, 255, 255, 0.92)",
  backgroundColor: "rgba(255, 255, 255, 0.03)",
  boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.04)",
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(255, 255, 255, 0.14)",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(124, 198, 255, 0.34)",
  },
  "& input": {
    px: 0.25,
  },
  "& input::placeholder": {
    color: "rgba(255, 255, 255, 0.42)",
    opacity: 1,
  },
  "& .MuiSvgIcon-root": {
    color: "rgba(255, 255, 255, 0.54)",
  },
};

const navMenuPaperSx = {
  mt: 1,
  borderRadius: 3,
  border: "1px solid rgba(255, 255, 255, 0.08)",
  background:
    "linear-gradient(180deg, rgba(29, 29, 29, 0.98) 0%, rgba(18, 18, 18, 0.96) 100%)",
  backdropFilter: "blur(24px)",
  boxShadow: "0 24px 48px rgba(0, 0, 0, 0.34)",
  overflow: "hidden",
};

const navMenuListSx = {
  p: 0.75,
  bgcolor: "transparent",
};

const mobileNavSurfaceSx = {
  display: "flex",
  alignItems: "center",
  gap: 1,
  width: "100%",
  px: 1,
  py: 0.75,
  borderRadius: 999,
  border: "1px solid rgba(255, 255, 255, 0.08)",
  background:
    "linear-gradient(180deg, rgba(22, 22, 22, 0.96) 0%, rgba(13, 13, 13, 0.92) 100%)",
  boxShadow: "0 16px 40px rgba(0, 0, 0, 0.2)",
};

const mobileNavIconButtonSx = {
  width: 40,
  height: 40,
  borderRadius: "50%",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  backgroundColor: "rgba(255, 255, 255, 0.05)",
  color: "#ffffff",
};

const mobileNavDrawerPaperSx = {
  borderBottomLeftRadius: 24,
  borderBottomRightRadius: 24,
  border: "1px solid rgba(255, 255, 255, 0.08)",
  background:
    "linear-gradient(180deg, rgba(21, 21, 21, 0.98) 0%, rgba(12, 12, 12, 0.96) 100%)",
  boxShadow: "0 30px 60px rgba(0, 0, 0, 0.32)",
};

export {
  mobileNavDrawerPaperSx,
  mobileNavIconButtonSx,
  mobileNavSurfaceSx,
  navActionsContainerSx,
  navActionsGroupSx,
  navBadgeSx,
  navBarClusterSx,
  navHomeButtonSx,
  navIconButtonSx,
  navMenuListSx,
  navMenuPaperSx,
  navPrimaryButtonSx,
  navSearchAutocompleteSx,
  navSearchInputSx,
  navSecondaryButtonSx,
  navSurfaceSx,
};
