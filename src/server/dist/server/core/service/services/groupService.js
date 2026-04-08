"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupService = void 0;
const groupLifecycleHandler_1 = require("../handlers/groupLifecycleHandler");
const membershipHandler_1 = require("../handlers/membershipHandler");
const buildGroupNameLookup_1 = require("../../lib/utils/buildGroupNameLookup");
class GroupService {
    db;
    policy;
    groupLifecycle;
    memberships;
    constructor(db, policy) {
        this.db = db;
        this.policy = policy;
        this.groupLifecycle = new groupLifecycleHandler_1.GroupLifecycleHandler(this.db, this.policy);
        this.memberships = new membershipHandler_1.MembershipHandler(this.db, this.policy);
    }
    async getGroupCategories() {
        return await this.db.categories.getCategories();
    }
    async getGroupNameDictionary() {
        const groups = await this.db.groups.getGroups();
        return (0, buildGroupNameLookup_1.buildGroupNameLookup)(groups);
    }
    async getAllGroups() {
        return await this.db.groups.getGroups();
    }
    async searchGroups(query) {
        return await this.db.groups.searchGroups(query);
    }
    async getAllGroupMembers(group_id) {
        return await this.db.groupMembers.getGroupMembers(group_id);
    }
    async getOrganizerEmail(group_id) {
        const organizer = await this.db.groupMembers.getOrganizer(group_id);
        return this.db.auth.getEmailByUserId(organizer.user_id);
    }
    async getGroupFromSlug(slug) {
        return await this.db.groups.getGroupBySlug(slug);
    }
}
exports.GroupService = GroupService;
//# sourceMappingURL=groupService.js.map