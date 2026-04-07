"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriesClient = void 0;
const categoriesSchema_1 = require("@/src/schemas/groups/categoriesSchema");
class CategoriesClient {
    db;
    constructor(db) {
        this.db = db;
    }
    async getCategories() {
        const raw = await this.getAllCategories();
        return this.parseCategories(raw);
    }
    async getAllCategories() {
        return await this.db
            .selectFrom("categories")
            .selectAll()
            .orderBy("categories.name")
            .execute();
    }
    parseCategories(raw) {
        const parsed = raw;
        categoriesSchema_1.CategoriesValidator.Check(parsed);
        return parsed;
    }
}
exports.CategoriesClient = CategoriesClient;
//# sourceMappingURL=CategoriesClient.js.map