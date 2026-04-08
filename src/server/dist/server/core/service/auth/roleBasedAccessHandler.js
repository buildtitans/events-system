"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleBasedAccessHandler = void 0;
class RoleBasedAccessHandler {
    db;
    constructor(db) {
        this.db = db;
    }
    async can(user_id, group_id, action) {
        if (!user_id)
            return false;
        const role = await this.getRoleInGroup(user_id, group_id);
        return this.rolePermission(role, action);
    }
    async getRoleInGroup(user_id, group_id) {
        return await this.db.groupMembers.getMembershipRole(user_id, group_id);
    }
    rolePermission(role, action) {
        switch (action) {
            case "manage group": {
                if (role === "organizer") {
                    return true;
                }
                else {
                    return false;
                }
            }
            case "manage events": {
                if (role === "organizer") {
                    return true;
                }
                else {
                    return false;
                }
            }
            case "change membership": {
                if (role === "anonymous" || role === "member") {
                    return true;
                }
                else {
                    return false;
                }
            }
            case "read or receive notifications": {
                if (role === "member" || role === "organizer") {
                    return true;
                }
                else {
                    return false;
                }
            }
            default: {
                return false;
            }
        }
    }
    checkPermission(action, role) {
        switch (action) {
            case "create event":
            case "cancel event":
            case "update event": {
                if (role === "organizer") {
                    return true;
                }
                else {
                    return false;
                }
            }
            case "leave group": {
                if (role === "member") {
                    return true;
                }
                else {
                    return false;
                }
            }
            case "join group": {
                if (role === "anonymous") {
                    return true;
                }
                else {
                    return false;
                }
            }
        }
    }
}
exports.RoleBasedAccessHandler = RoleBasedAccessHandler;
//# sourceMappingURL=roleBasedAccessHandler.js.map