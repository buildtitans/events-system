"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const chunkUserGroupsToPages_1 = require("../../lib/utils/chunkUserGroupsToPages");
const validateLoginCredentials_1 = require("../../lib/validation/validateLoginCredentials");
class UserService {
    api;
    policy;
    constructor(api, policy) {
        this.api = api;
        this.policy = policy;
    }
    async createNewUser(emailInput, passwordInput) {
        const { email, password } = (0, validateLoginCredentials_1.validateLoginCredentials)(emailInput, passwordInput);
        return await this.api.auth.signUp(email, password);
    }
    async getGroupsCreated(user_id) {
        const userId = this.policy.requireAuthenticated(user_id);
        const createdGroups = await this.api.groups.getGroupsByOrganizerId(userId);
        return (0, chunkUserGroupsToPages_1.chunkUserGroupsIntoPages)(createdGroups);
    }
    async getEmailById(user_id) {
        const userId = this.policy.requireAuthenticated(user_id);
        const { email } = await this.api.auth.getEmailByUserId(userId);
        return email;
    }
}
exports.UserService = UserService;
//# sourceMappingURL=userService.js.map