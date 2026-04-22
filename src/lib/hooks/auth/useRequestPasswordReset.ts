import { trpcClient } from "@/src/trpc/trpcClient";
import {
  InputErrorsType,
  SignupCredentialsType,
} from "./useValidateSignupCredentials";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { requestResetPassword } from "../../store/slices/user/userSlice";

type RequestPasswordResetHookParameters = {
  emailError: InputErrorsType["invalidEmail"];
  email: SignupCredentialsType["email"];
};

type RequestPasswordResetHook = {
  submitPasswordResetRequest: () => Promise<void>;
};

export const useRequestPasswordReset = ({
  emailError,
  email,
}: RequestPasswordResetHookParameters): RequestPasswordResetHook => {
  const dispatch = useDispatch<AppDispatch>();

  const submitPasswordResetRequest = async () => {
    if (emailError === "Please enter a valid email") {
      return;
    }

    dispatch(requestResetPassword({ status: "pending" }));

    const result = await trpcClient.users.requestPasswordReset.mutate(email);

    if (result) {
      dispatch(requestResetPassword({ status: "ready", data: result }));
    } else {
      dispatch(
        requestResetPassword({
          status: "failed",
          error: "Couldn't send email for reset",
        }),
      );
    }
  };

  return {
    submitPasswordResetRequest,
  };
};
