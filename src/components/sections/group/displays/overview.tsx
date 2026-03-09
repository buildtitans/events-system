import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import GroupCalandar from "@/src/features/group/groupCalandar";

export default function Overview() {
  return (
    <Container disableGutters>
      <Stack
        gap={4}
      >
        <GroupCalandar />
      </Stack>
    </Container>
  );
}
