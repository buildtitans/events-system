import Stack from "@mui/material/Stack";
import GroupCalandar from "@/src/features/group/groupCalandar";

export default function Overview() {
  return (
      <Stack
        alignItems={"start"}
        justifyContent={'start'}
        gap={4}
      >
        <GroupCalandar />
      </Stack>
  );
}
