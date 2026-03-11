const overrides = {
  display: "flex",
  flexDirection: {
    xs: "column-reverse",
    md: "row",
  },
  width: "100%",
  justifyContent: "space-between",
  alignItems: {
    xs: "start",
    md: "center",
  },
  gap: 4,
  overflow: "auto",
};

const sidebarStyles = {
  width: {
    xs: "auto",
    md: "140px",
    lg: "180px",
    xl: "200px",
  },
  backgroundColor: "#191919",
  display: "flex",
  flexDirection: { xs: "row", sm: "column" },
  justifyContent: "center",
  alignItems: "center",
  border: "none",
};

const searchBarSx = {
  transition: "ease-in-out",
  transitionDuration: "200ms",
  borderRadius: 999,
  xs: "100%",
  md: "25ch",
  width: "400px",
};

const navActionsButtonSx = {
  borderRadius: 999,
  backgroundColor: "white",
  color: "black",
  textWrap: "nowrap",
  ":hover": {
    bgcolor: "rgba(255, 255, 255, 0.1)",
    color: "white",
    transition: "all 0.3s ease",
  },
};

const createGroupButtonSx = {
  borderRadius: 999,
  textWrap: "nowrap",
  ":hover": {
    bgcolor: "rgba(255, 255, 255, 0.1)",
    color: "white",
    transition: "all 0.3s ease",
  },
};

const PANEL_GRAY = "#212121";

export {
  overrides,
  searchBarSx,
  PANEL_GRAY,
  navActionsButtonSx,
  sidebarStyles,
  createGroupButtonSx,
};
