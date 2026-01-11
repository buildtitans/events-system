import { Type, Static } from "@sinclair/typebox";
import { EventSchema } from "./eventSchema";

const CardVariantTypeSchema = Type.Union([Type.Literal("hero"), Type.Literal("thumbnail")])

const SlotSizeSchema = Type.Object({
    xs: Type.Literal(12),
    md: Type.Union([Type.Literal(6), Type.Literal(4)])
})

const CardDesignationSchema = Type.Object({
    size: SlotSizeSchema,
    type: CardVariantTypeSchema
})


const LayoutSlotSchema = Type.Union([
    Type.Object({
        kind: Type.Literal("card"),
        variant: CardDesignationSchema,
        event: EventSchema
    }),
    Type.Object({
        kind: Type.Literal("stack"),
        events: Type.Array(EventSchema, { minItems: 2 })
    })
]);


const LayoutSlotSchemaArray = Type.Array(LayoutSlotSchema);

type LayoutSlotSchemaArrayType = Static<typeof LayoutSlotSchemaArray>;

type LayoutSlotSchemaType = Static<typeof LayoutSlotSchema>;

type SlotSizeSchemaType = Static<typeof SlotSizeSchema>;

type CardVariantTypeSchemaType = Static<typeof CardVariantTypeSchema>


export type { LayoutSlotSchemaType, SlotSizeSchemaType, CardVariantTypeSchemaType, LayoutSlotSchemaArrayType };

export { LayoutSlotSchema, LayoutSlotSchemaArray };