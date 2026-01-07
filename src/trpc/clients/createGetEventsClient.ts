

export function createGetEventsClient(baseUrl: string) {
    return {
        async getEvents() {
            const res = await fetch(`${baseUrl}/api/events`, { method: "GET" });

            if (!res.ok) {
                const text = await res.text().catch(() => "");
                throw new Error(`GET /api/events failed: ${res.status} ${text}`);
            }
            return res.json();
        },
    };
}