import { getResendKey, getResetUrl } from "./getModeEnv";

export type ResendVariables = {
  resendUrl: string;
  resendKey: string;
};

function getResendVars(): ResendVariables {
  const resendUrl = getResetUrl();
  const resendKey = getResendKey();

  return { resendUrl, resendKey };
}

export const resendSecrets = getResendVars() satisfies ResendVariables;
