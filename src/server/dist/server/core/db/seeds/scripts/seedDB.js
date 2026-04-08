"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const seedCategories_1 = require("./seedCategories");
const seedGroups_1 = require("./seedGroups");
const seedEvents_1 = require("./seedEvents");
const seedUsers_1 = require("./seedUsers");
const seedGroupMembers_1 = require("./seedGroupMembers");
const seedEventAttendants_1 = require("./seedEventAttendants");
async function seedDB() {
    console.log("Seeding DB…");
    const categoriesBySlug = await (0, seedCategories_1.seedCategories)();
    console.log("Categories OK");
    const usersByEmail = await (0, seedUsers_1.seedUsers)();
    console.log("Users OK");
    const groupBySlug = await (0, seedGroups_1.seedGroups)(categoriesBySlug, usersByEmail);
    console.log("Groups OK");
    await (0, seedEvents_1.seedEvents)(groupBySlug);
    console.log("Events OK");
    const membersByGroupId = await (0, seedGroupMembers_1.seedGroupMembers)(groupBySlug);
    console.log("Group Members OK");
    await (0, seedEventAttendants_1.seedEventAttendants)(membersByGroupId);
    console.log("Event Attendants OK");
    process.exit(0);
}
seedDB().catch((err) => {
    console.error("Seed failed", err);
    process.exit(1);
});
//# sourceMappingURL=seedDB.js.map