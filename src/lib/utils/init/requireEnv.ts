function requireEnv(value: string | undefined, label: string): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${label}`);
  }

  return value;
}

export const TRPC_ROUTE = "/api/trpc";

function normalizeTrpcUrl(value: string): string {
  const trimmedValue = value.trim().replace(/\/+$/, "");

  if (trimmedValue.endsWith(TRPC_ROUTE)) {
    return trimmedValue;
  }

  if (trimmedValue.endsWith("/trpc")) {
    return `${trimmedValue.slice(0, -"/trpc".length)}${TRPC_ROUTE}`;
  }

  return `${trimmedValue}${TRPC_ROUTE}`;
}

function isProdOrDev(nodeEnv: typeof process.env.NODE_ENV) {
  if (nodeEnv === "production") {
    return normalizeTrpcUrl(
      requireEnv(process.env.NEXT_PUBLIC_PROD_API_URL, "NEXT_PUBLIC_PROD_API_URL"),
    );
  } else {
    return normalizeTrpcUrl(
      requireEnv(process.env.NEXT_PUBLIC_DEV_API_URL, "NEXT_PUBLIC_DEV_API_URL"),
    );
  }
}

export const trpcClientUrl = {
  FASTIFY_SERVER_URL: isProdOrDev(process.env.NODE_ENV),
};

export const devServerBaseUrl = {
  FASTIFY_SERVER_URL: normalizeTrpcUrl(
    requireEnv(process.env.NEXT_PUBLIC_DEV_API_URL, "NEXT_PUBLIC_DEV_API_URL"),
  ),
};

export const prodServerBaseUrl = {
  FASTIFY_SERVER_URL: normalizeTrpcUrl(
    requireEnv(process.env.NEXT_PUBLIC_PROD_API_URL, "NEXT_PUBLIC_PROD_API_URL"),
  ),
};
