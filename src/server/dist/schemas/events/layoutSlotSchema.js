"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardDesignationSchema = exports.CardVariantTypeSchema = exports.PaginatedLayoutSchema = exports.LayoutSlotSchemaArray = exports.LayoutSlotSchema = void 0;
const typebox_1 = require("@sinclair/typebox");
const eventSchema_1 = require("../events/eventSchema");
const CardVariantTypeSchema = typebox_1.Type.Union([
    typebox_1.Type.Literal("hero"),
    typebox_1.Type.Literal("thumbnail"),
]);
exports.CardVariantTypeSchema = CardVariantTypeSchema;
const SlotSizeSchema = typebox_1.Type.Object({
    xs: typebox_1.Type.Literal(12),
    md: typebox_1.Type.Union([typebox_1.Type.Literal(6), typebox_1.Type.Literal(4)]),
});
const CardDesignationSchema = typebox_1.Type.Object({
    size: SlotSizeSchema,
    type: CardVariantTypeSchema,
});
exports.CardDesignationSchema = CardDesignationSchema;
const LayoutSlotSchema = typebox_1.Type.Union([
    typebox_1.Type.Object({
        kind: typebox_1.Type.Literal("card"),
        variant: CardDesignationSchema,
        event: eventSchema_1.EventSchema,
    }),
    typebox_1.Type.Object({
        kind: typebox_1.Type.Literal("stack"),
        events: typebox_1.Type.Array(eventSchema_1.EventSchema),
    }),
]);
exports.LayoutSlotSchema = LayoutSlotSchema;
const LayoutSlotSchemaArray = typebox_1.Type.Array(LayoutSlotSchema);
exports.LayoutSlotSchemaArray = LayoutSlotSchemaArray;
const PaginatedLayoutSchema = typebox_1.Type.Array(LayoutSlotSchemaArray);
exports.PaginatedLayoutSchema = PaginatedLayoutSchema;
//# sourceMappingURL=layoutSlotSchema.js.map