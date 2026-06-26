export const ENV_MAP = {
  dbPassword: "PGPASSWORD",
  pghost: "PGHOST",
  dbPort: "PGPORT",
  postgresDb: "PGDATABASE",
  db_user: "PGUSER",

  cookies_secret: "COOKIES_SECRET",
  client_url: "CLIENT_URL",
  fastifyHost: "FASTIFY_HOST",
  fastifyPort: "FASTIFY_PORT",
  pwResetUrl: "PW_RESET_URL",
  resendKey: "RESEND_API_KEY",
  geoApifyKey: "GEOAPIFY_API_KEY",
  geoApifyUrl: "GEOAPIFY_REQ_BASE_URL",
} as const;

export type EnvKey = keyof typeof ENV_MAP;
