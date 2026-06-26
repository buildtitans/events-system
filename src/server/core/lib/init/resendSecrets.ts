import { getEnv } from "./getEnv";

export type ResendVariables = {
  resendUrl: string;
  resendKey: string;
};

function getResendVars(): ResendVariables {
  const resendUrl = getEnv("pwResetUrl");
  const resendKey = getEnv("resendKey");

  return { resendUrl, resendKey };
}

export const resendSecrets = getResendVars() satisfies ResendVariables;
