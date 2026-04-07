"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compileEventsLayout = compileEventsLayout;
const validateSchema_1 = require("@/src/shared/utils/validation/validateSchema");
const utils_1 = require("@/src/server/core/layout/utils");
function compileEventsLayout(rows) {
    const raw = (0, utils_1.formatRawEvents)(rows);
    const layout = (0, utils_1.buildLayoutSlots)(raw);
    return (0, validateSchema_1.layoutSlotValidator)(layout);
}
//# sourceMappingURL=compileEventsLayout.js.map