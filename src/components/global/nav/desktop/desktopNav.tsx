import NavBar from "../toolbar/navBar";
import NavActions, { NavActionsProps } from "../toolbar/navActions";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";

export type NavProps = Pick<NavActionsProps, "openSignupDrawer" | "showSignoutModal">;

export default function DesktopNav({ 
    showSignoutModal,
    openSignupDrawer
}: NavProps) {
    const userKind = useSelector((s:RootState) => s.auth.userKind)

    return (
        <>
        <NavBar
        userKind={userKind}
        />
        <NavActions 
        openSignupDrawer={openSignupDrawer}
        showSignoutModal={showSignoutModal}
        userKind={userKind}
        />
        </>
    )
}