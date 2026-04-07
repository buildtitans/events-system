"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCardSizing = getCardSizing;
function getCardSizing(type) {
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
//# sourceMappingURL=getCardSizing.js.map