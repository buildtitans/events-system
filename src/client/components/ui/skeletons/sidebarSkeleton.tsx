import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { groupSidebarSkeletonSx } from "@/src/client/styles/sx/groupSidebar";

export default function SidebarSkeleton() {
  return (
    <Box sx={groupSidebarSkeletonSx}>
      <Skeleton
        variant="rounded"
        animation="wave"
        width="100%"
        height="100%"
        sx={{
          borderRadius: 4,
          bgcolor: "rgba(255, 255, 255, 0.04)",
        }}
      />
    </Box>
  );
}


