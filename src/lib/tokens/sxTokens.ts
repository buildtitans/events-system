const sidebarStyles = {
  width: {
    xs: "100%",
    md: "160px",
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

const activeCategorySx = {
  display: "flex",
  width: "100%",
  justifyContent: "flex-start",
  alignItems: "center",
  overflowX: "auto",
  overflowY: "hidden",
};

const DAY_MONTH_YEAR_HOUR_FORMAT = "MMMM D, YYYY h:mm A";

export { sidebarStyles, DAY_MONTH_YEAR_HOUR_FORMAT, activeCategorySx };
