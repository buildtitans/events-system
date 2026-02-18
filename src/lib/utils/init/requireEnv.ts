function requireEnv(
    value: string | undefined,
    label: string
): string {
    if (!value) {
        throw new Error(`Missing required environment variable: ${label}`);
    }

    return value;
};

export const env = {
    FASTIFY_SERVER_URL: requireEnv(process.env.NEXT_PUBLIC_FASTIFY_SERVER_URL, "NEXT_PUBLIC_FASTIFY_SERVER_URL"),
};
