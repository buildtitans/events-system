import { initTRPC } from '@trpc/server';
import type { Context } from './routers/context';

const t = initTRPC.context<Context>().create();

const router = t.router;
const publicProcedure = t.procedure;

export { router, publicProcedure };
