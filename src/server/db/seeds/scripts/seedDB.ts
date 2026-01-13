import { seedCategories } from "./seedCategories";
import { seedGroups } from "./seedGroups";
import { seedEvents } from "./seedEvents";

async function seedDB() {
    console.log("Seeding DB…");

    const categoriesBySlug = await seedCategories();
    console.log("Categories OK");

    const groupsBySlug = await seedGroups(categoriesBySlug);
    console.log("Groups OK");

    await seedEvents(groupsBySlug);
    console.log("Events OK");

    process.exit(0);
}

seedDB().catch(err => {
    console.error("Seed failed", err);
    process.exit(1);
});
