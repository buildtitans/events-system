"use client";
import { AppDispatch, RootState } from "@/src/lib/store";
import SignInCard from "../../sections/forms/SignInCard";
import Drawer from "@mui/material/Drawer";
import type { JSX } from "react";
import { useDispatch, useSelector } from "react-redux";
import { enqueueDrawer } from "@/src/lib/store/slices/RenderingSlice";
import { useValidateCredentials } from "@/src/lib/hooks/validation/useValidateCredentialsInput";
import { useLogin } from "@/src/lib/hooks/auth/useLogin";

export default function SignInDrawer(): JSX.Element | null {
    const activeDrawer = useSelector((s: RootState) => s.rendering.drawer);
    const dispatch = useDispatch<AppDispatch>();
    const {
        isSubmittable,
        emailErrorMessage,
        emailError,
        passwordError,
        passwordErrorMessage,
        credentials,
        handleEmail,
        handlePassword,
    } = useValidateCredentials();

    const { handleSubmit } = useLogin(credentials);

    return (
        <Drawer
            anchor="right"
            open={(activeDrawer === "Sign In Drawer")}
            onClose={() => dispatch(enqueueDrawer(null))}
            transitionDuration={{ enter: 300, exit: 250 }}
            sx={{
                height: '100%',
            }}
            slotProps={{
                paper: {
                    elevation: 4,
                    sx: {
                        width: 500,
                        backgroundColor: 'black',
                    },
                }
            }}
        >
            <SignInCard
                isSubmittable={isSubmittable}
                emailErrorMessage={emailErrorMessage}
                emailError={emailError}
                passwordError={passwordError}
                passwordErrorMessage={passwordErrorMessage}
                handleEmail={handleEmail}
                handleSubmit={handleSubmit}
                handlePassword={handlePassword}
            />
        </Drawer>
    )
}