"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chunkUserGroupsIntoPages = chunkUserGroupsIntoPages;
function chunkUserGroupsIntoPages(groups, size = 6) {
    const chunked = [];
    for (let i = 0; i < groups.length; i += size) {
        const chunk = groups.slice(i, i + size);
        chunked.push(chunk);
    }
    return chunked;
}
//# sourceMappingURL=chunkUserGroupsToPages.js.map