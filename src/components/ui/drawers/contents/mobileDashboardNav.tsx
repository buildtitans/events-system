import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/src/lib/store";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { UserAccountViewType } from "@/src/lib/store/slices/user/types";
import { changeAccountTab } from "@/src/lib/store/slices/user/userSlice";

export default function MobileDashboardNav() {
  const dispatch = useDispatch<AppDispatch>();
  const displayed = useSelector((s: RootState) => s.user.view);
  const labels: UserAccountViewType[] = ["my groups", "memberships", "rsvps"]; 

  return (
        <Paper
          component={"nav"}
          variant="outlined"
          sx={{
            width: "100%",
            height: "100%",
            backgroundColor: "paper.background",
            borderTop: 1,
            borderTopColor: "rgba(255, 255, 255, 0.4)",
            padding: 2,

          }}
        >
            <Stack 
            gap={2}
            direction={"row"} 
            alignItems={"center"} 
            justifyContent={"center"}
            >
                {labels.map((label) => (
                    <Button
                    size="small"
                    key={label}
                    onClick={() => dispatch(changeAccountTab(label))}
                type="button"
                variant={(displayed === label) ? "contained" : "outlined"}
                
                >
                    {label}
                </Button>
                ))}
                
            </Stack>
        </Paper>
  );
}
