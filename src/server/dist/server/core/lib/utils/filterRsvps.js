"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterUserRsvps = filterUserRsvps;
function filterUserRsvps(records) {
    const test = {};
    for (let i = 0; i < records.length; i++) {
        const record = records[i];
        const status = records[i].status;
        if (status === "going" || status === "interested")
            test[record.event_id] = record.status;
    }
    return test;
}
//# sourceMappingURL=filterRsvps.js.map