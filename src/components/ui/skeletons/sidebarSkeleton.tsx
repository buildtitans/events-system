import Skeleton from "@mui/material/Skeleton";

export default function SidebarSkeleton() {
  return (
    <Skeleton
      variant="rectangular"
      animation="wave"
      width="100%"
      height="100%"
      sx={{
        bgcolor: "rgba(255, 255, 255, 0.015)",
      }}
    />
  );
}


