const sidebarDesktopWidths = {
  compact: 230,
  full: 250,
} as const;

const getDesktopSidebarWidth = (lgScreen: boolean) =>
  lgScreen ? sidebarDesktopWidths.full : sidebarDesktopWidths.compact;

const getDesktopSidebarOffsetSx = (sidebarOpen: boolean) => ({
  width: "100%",
  minHeight: "100svh",
  pl: {
    xs: 0,
    sm: sidebarOpen ? `${sidebarDesktopWidths.compact}px` : 0,
    lg: sidebarOpen ? `${sidebarDesktopWidths.full}px` : 0,
  },
  transition: "padding-left 300ms ease",
});

export {
  getDesktopSidebarOffsetSx,
  getDesktopSidebarWidth,
  sidebarDesktopWidths,
};
