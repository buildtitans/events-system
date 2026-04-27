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
export { overrides, sidebarStyles, bottomDrawerSx };
