import { z } from "zod";

const EventPaginationSchema = z.object({
    page: z.number(),
    limit: z.number()
});

type EventPaginationSchemaType = z.infer<typeof EventPaginationSchema>;

export type { EventPaginationSchemaType };

export { EventPaginationSchema };