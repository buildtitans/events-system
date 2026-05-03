import NavBar from "../toolbar/navBar";
import NavActions, { NavActionsProps } from "../toolbar/navActions";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import Box from "@mui/material/Box";
import { navSurfaceSx } from "@/src/styles/sx/nav";

export type NavProps = Pick<NavActionsProps, "openSignupDrawer" | "showSignoutModal">;

export default function DesktopNav({ 
    showSignoutModal,
    openSignupDrawer
}: NavProps) {
    const userKind = useSelector((s:RootState) => s.auth.userKind)

    return (
        <Box sx={navSurfaceSx}>
            <NavBar
            />
            <NavActions 
            openSignupDrawer={openSignupDrawer}
            showSignoutModal={showSignoutModal}
            userKind={userKind}
            />
        </Box>
    )
}
