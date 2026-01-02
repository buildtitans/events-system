import type { HealthCheck } from "../types/types";

async function checkFastifyHealth(): Promise<HealthCheck> {
    const res = await fetch("/api/health");

    if (!res.ok) {
        throw new Error("Failed to get health check from fastify server");
    }

    return res.json();
};

export { checkFastifyHealth };
