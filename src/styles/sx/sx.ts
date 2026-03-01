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

const searchBarSx = {
  transition: "ease-in-out",
  transitionDuration: "200ms",
  borderRadius: 999,
  xs: "100%",
  md: "25ch",
  width: "400px",
};

export { overrides, searchBarSx };
