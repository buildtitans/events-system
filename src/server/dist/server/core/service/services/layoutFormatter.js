"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LayoutFormatter = void 0;
const validateSchema_1 = require("@/src/shared/utils/validation/validateSchema");
const utils_1 = require("../../layout/utils");
const chunkIntoPages_1 = require("../../layout/utils/chunkIntoPages");
class LayoutFormatter {
    constructor() { }
    compileLayout(events) {
        const layout = this.buildLayoutSlots(events);
        return (0, validateSchema_1.layoutSlotValidator)(layout);
    }
    buildLayoutSlots(events) {
        const paginatedEvents = (0, chunkIntoPages_1.chunkEventsIntoPages)(events);
        const paginatedLayoutSlots = [];
        for (const page of paginatedEvents) {
            const slots = [];
            let i = 0;
            while (i < page.length) {
                const slot = (0, utils_1.designateLayoutSlot)(i, page.length);
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
}
exports.LayoutFormatter = LayoutFormatter;
//# sourceMappingURL=layoutFormatter.js.map