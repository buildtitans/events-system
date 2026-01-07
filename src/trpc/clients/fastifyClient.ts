

export function createFastifyClient(baseUrl: string) {
    return {
        async getEvents() {
            const res = await fetch(`${baseUrl}/api/events`, { method: "GET" });

            if (!res.ok) {
                const text = await res.text().catch(() => "");
                throw new Error(`Fastify GET /api/events failed: ${res.status} ${text}`);
            }
            return res.json();
        },
    };
}