"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupLifecycleHandler = void 0;
class GroupLifecycleHandler {
    api;
    policy;
    constructor(api, policy) {
        this.api = api;
        this.policy = policy;
    }
    async createNewGroup(user_id, newGroupInput) {
        const id = this.policy.requireAuthenticated(user_id);
        const group = await this.api.groups.createGroup(newGroupInput, id);
        await this.assignOrganizerToNewGroup({
            user_id: group.organizer_id,
            group_id: group.id,
        });
        return group;
    }
    async assignOrganizerToNewGroup(organizer) {
        return await this.api.groupMembers.addOrganizer(organizer);
    }
}
exports.GroupLifecycleHandler = GroupLifecycleHandler;
//# sourceMappingURL=groupLifecycleHandler.js.map