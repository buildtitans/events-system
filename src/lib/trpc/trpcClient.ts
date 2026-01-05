import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { TrpcAppRouter } from '@/src/server/core/trpc';

export const trpcClient = createTRPCProxyClient<TrpcAppRouter>({
    links: [
        httpBatchLink({
            url: 'http://localhost:3001/trpc',
        }),
    ],
});
