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

const bottomDrawerSx = {
  width: "100%",
  backgroundColor: "#191919",
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  border: "none",
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
export { overrides, sidebarStyles, createGroupButtonSx, bottomDrawerSx };
