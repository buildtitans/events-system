import type { NextResponse } from "next/server";

type HealthCheck = { ok: boolean };

type HealthCheckResponse = Promise<NextResponse<HealthCheck>>;

export type { HealthCheck, HealthCheckResponse };

export type MountStatus = 'active' | 'idle';