"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildLayoutSlots = buildLayoutSlots;
const designateLayoutSlot_1 = require("./designateLayoutSlot");
const chunkIntoPages_1 = require("./chunkIntoPages");
function buildLayoutSlots(events) {
    const paginatedEvents = (0, chunkIntoPages_1.chunkEventsIntoPages)(events);
    const paginatedLayoutSlots = [];
    for (const page of paginatedEvents) {
        const slots = [];
        let i = 0;
        while (i < page.length) {
            const slot = (0, designateLayoutSlot_1.designateLayoutSlot)(i, page.length);
            if (slot.kind === "card") {
                slots.push({
                    kind: "card",
                    variant: slot.variant,
                    event: page[i],
                });
                i += 1;
            }
            else {
                const remaining = page.length - i;
                const count = Math.min(slot.count, remaining);
                slots.push({
                    kind: "stack",
                    events: page.slice(i, i + count),
                });
                i += count;
            }
        }
        paginatedLayoutSlots.push(slots);
    }
    return paginatedLayoutSlots;
}
//# sourceMappingURL=buildLayoutSlots.js.map