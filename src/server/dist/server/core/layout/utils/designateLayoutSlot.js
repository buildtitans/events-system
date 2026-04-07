"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.designateLayoutSlot = designateLayoutSlot;
const getCardSizing_1 = require("./getCardSizing");
function designateLayoutSlot(index, pageLength) {
    if (index === 3 && pageLength - index >= 2) {
        return { kind: "stack", count: 2 };
    }
    if (index === 2 || index === 5) {
        const cardSize = (0, getCardSizing_1.getCardSizing)("thumbnail");
        return {
            kind: "card", variant: {
                type: "thumbnail", size: cardSize
            }
        };
    }
    return {
        kind: "card", variant: {
            type: "hero", size: (0, getCardSizing_1.getCardSizing)("hero")
        }
    };
}
//# sourceMappingURL=designateLayoutSlot.js.map