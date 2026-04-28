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
    md: "200px",
  },
  backgroundColor: "#191919",
  display: "flex",
  flexDirection: { xs: "row", sm: "column" },
  justifyContent: "center",
  alignItems: "center",
  border: "none",
};
export { overrides, sidebarStyles };
