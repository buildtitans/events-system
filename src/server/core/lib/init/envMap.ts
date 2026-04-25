export const ENV_MAP = {
  dbPassword: "PGPASSWORD",
  pghost: "PGHOST",
  dbPort: "PGPORT",
  postgresDb: "PGDATABASE",
  db_user: "PGUSER",
  cookies_secret: "COOKIES_SECRET",

  devClientUrl: "DEV_CLIENT_URL",
  prodFastifyHost: "PROD_FASTIFY_HOST",
  prodFastifyPort: "PROD_FASTIFY_PORT",

  devPwResetUrl: "DEV_PW_RESET_URL",
  pwResetUrl: "PROD_PW_RESET_URL",
  resendProdKey: "RESEND_API_KEY",
  resendDevKey: "RESEND_DEV_API_KEY",

  geoApifyKey: "GEOAPIFY_API_KEY",
  geoApifyUrl: "GEOAPIFY_REQ_BASE_URL",
} as const;

export type EnvKey = keyof typeof ENV_MAP;
