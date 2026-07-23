import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

export default function Spinner() {
  return (
    <Box
      sx={{
        position: "relative",
        height: "auto",
        width: "auto",
        margin: "auto",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <CircularProgress />
      </Box>
    </Box>
  );
}

export function GroupPanelSpinner() {
  return (
    <Box sx={{ position: "relative", height: "auto", width: "auto" }}>
      <CircularProgress />
    </Box>
  );
}
