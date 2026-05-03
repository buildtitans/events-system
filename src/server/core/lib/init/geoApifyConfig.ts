import { getEnv } from "./getEnv";

export type GeoapifyConfig = {
  geoApifyKey: string;
  geoApifyUrl: string;
};

function getGeoapifySecrets() {
  const geoApifyKey = getEnv("geoApifyKey");
  const geoApifyUrl = getEnv("geoApifyUrl");

  return { geoApifyKey, geoApifyUrl };
}

export const geoApifyConfig = getGeoapifySecrets() satisfies GeoapifyConfig;
