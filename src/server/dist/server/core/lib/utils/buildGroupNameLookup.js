"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildGroupNameLookup = buildGroupNameLookup;
function buildGroupNameLookup(groups) {
    const lookup = {};
    for (const group of groups) {
        lookup[group.id] = {
            name: group.name,
            slug: group.slug,
            group_description: group.description,
        };
    }
    return lookup;
}
//# sourceMappingURL=buildGroupNameLookup.js.map