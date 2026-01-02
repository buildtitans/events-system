import { NextResponse } from "next/server"
import type { HealthCheckResponse } from "@/src/lib/types/types";

//Simple scaffolding to test Fastify server spinup

async function GET(): HealthCheckResponse {

    const res = await fetch(' http://localhost:3001/health', {
        cache: "no-store",
    });

    if (!res.ok) return NextResponse.json({ ok: false }, { status: 500 });

    const result = await res.json();
    return NextResponse.json(result);
};

export { GET };