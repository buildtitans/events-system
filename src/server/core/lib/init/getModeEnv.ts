import type { EnvKey } from "../../lib/init/envMap";
import { getEnv } from "./getEnv";

function getModeEnv(prodKey: EnvKey, nonProdKey: EnvKey): string {
  const key = process.env.NODE_ENV === "production" ? prodKey : nonProdKey;
  return getEnv(key);
}

function getResetUrl(): string {
  return getModeEnv("pwResetUrl", "devPwResetUrl");
}

function getResendKey(): string {
  return getModeEnv("resendProdKey", "resendDevKey");
}

export { getResetUrl, getResendKey };
