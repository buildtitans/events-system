import { seedCategories } from "./seedCategories";
import { seedGroups } from "./seedGroups";
import { seedEvents } from "./seedEvents";
import { seedUsers } from "./seedUsers";
import { seedGroupMembers } from "./seedGroupMembers";

async function seedDB() {
    console.log("Seeding DB…");

    const categoriesBySlug = await seedCategories();
    console.log("Categories OK");

    const usersByEmail = await seedUsers();
    console.log("Users OK");
    const groupsBySlug = await seedGroups(categoriesBySlug, usersByEmail);
    console.log("Groups OK");

    await seedEvents(groupsBySlug);
    console.log("Events OK");

    await seedGroupMembers(groupsBySlug)
    console.log("Group Members OK");

    process.exit(0);
}

seedDB().catch(err => {
    console.error("Seed failed", err);
    process.exit(1);
});
