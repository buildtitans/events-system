"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LayoutFormatter = void 0;
const schemaValidators_1 = require("@/src/server/core/lib/validation/schemaValidators");
class LayoutFormatter {
    constructor() { }
    compileLayout(events) {
        const layout = this.buildLayoutSlots(events);
        return (0, schemaValidators_1.layoutSlotValidator)(layout);
    }
    buildLayoutSlots(events) {
        const paginatedEvents = this.chunkEventsIntoPages(events);
        const paginatedLayoutSlots = [];
        for (const page of paginatedEvents) {
            const slots = [];
            let i = 0;
            while (i < page.length) {
                const slot = this.designateLayoutSlot(i, page.length);
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
    chunkEventsIntoPages(events, maxPageLength = 6) {
        const pages = [];
        for (let i = 0; i < events.length; i += maxPageLength) {
            pages.push(events.slice(i, i + maxPageLength));
        }
        return pages;
    }
    designateLayoutSlot(index, pageLength) {
        if (index === 3 && pageLength - index >= 2) {
            return { kind: "stack", count: 2 };
        }
        if (index === 2 || index === 5) {
            const cardSize = this.getCardSizing("thumbnail");
            return {
                kind: "card",
                variant: {
                    type: "thumbnail",
                    size: cardSize,
                },
            };
        }
        return {
            kind: "card",
            variant: {
                type: "hero",
                size: this.getCardSizing("hero"),
            },
        };
    }
    getCardSizing(type) {
        switch (type) {
            case "hero":
                return {
                    md: 6,
                    xs: 12,
                };
            default:
                return {
                    md: 4,
                    xs: 12,
                };
        }
    }
}
exports.LayoutFormatter = LayoutFormatter;
//# sourceMappingURL=layoutFormatter.js.map