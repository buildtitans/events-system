import { seedGroups } from "./seedGroups";
import { seedCategories } from "./seedCategories";
import { seedEvents } from "./seedEvents";


async function seedDB(): Promise<void> {

    try {
        const categoriesBySlug = await seedCategories();
        const groupsBySlug = await seedGroups(categoriesBySlug);
        await seedEvents(groupsBySlug);
        console.log("Database seeded successfully");
    } catch (e) {
        console.error("Database seeding failed:", e);
        process.exit(1);
    }

}