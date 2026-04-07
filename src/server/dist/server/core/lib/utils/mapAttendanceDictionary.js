"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapAttendanceDictionary = mapAttendanceDictionary;
function mapAttendanceDictionary(ids, userAttendance) {
    const dictionary = {};
    if (userAttendance.length === 0) {
        ids.forEach((id) => {
            dictionary[`${id}`] = "not_going";
        });
    }
    for (const id of ids) {
        const rec = userAttendance.find((record) => record.event_id === id);
        const status = rec?.status;
        if (status) {
            dictionary[`${id}`] = status;
        }
        else {
            dictionary[`${id}`] = "not_going";
        }
    }
    return dictionary;
}
//# sourceMappingURL=mapAttendanceDictionary.js.map