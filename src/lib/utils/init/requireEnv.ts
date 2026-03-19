function requireEnv(value: string | undefined, label: string): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${label}`);
  }

  return value;
}

function isProdOrDev(nodeEnv: typeof process.env.NODE_ENV) {
  if (nodeEnv === "production") {
    return requireEnv(
      process.env.NEXT_PUBLIC_PROD_API_URL,
      "NEXT_PUBLIC_PROD_API_URL",
    );
  } else {
    return requireEnv(process.env.NEXT_PUBLIC_API_URL, "NEXT_PUBLIC_API_URL");
  }
}

export const trpcClientUrl = {
  FASTIFY_SERVER_URL: isProdOrDev(process.env.NODE_ENV),
};

export const devServerBaseUrl = {
  FASTIFY_SERVER_URL: requireEnv(
    process.env.NEXT_PUBLIC_API_URL,
    "NEXT_PUBLIC_API_URL",
  ),
};

export const prodServerBaseUrl = {
  FASTIFY_SERVER_URL: requireEnv(
    process.env.NEXT_PUBLIC_PROD_API_URL,
    "NEXT_PUBLIC_PROD_API_URL",
  ),
};
