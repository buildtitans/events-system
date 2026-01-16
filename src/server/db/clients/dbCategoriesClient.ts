import { Kysely } from "kysely";
import { DB } from "../types/db";
import { CategoriesValidator, type CategoriesSchemaType } from "@/src/schemas/categoriesSchema";
import type { Categories } from "../types/db";
import type { Selectable } from "kysely";

export class CategoriesClient {
    constructor(private readonly db: Kysely<DB>) { }


    async getCategories(): Promise<CategoriesSchemaType> {

        const raw = await this.getAllCategories();
        return this.parseCategories(raw)
    }

    async getAllCategories(): Promise<Selectable<Categories>[]> {

        return this.db
            .selectFrom("categories")
            .selectAll()
            .orderBy("categories.name")
            .execute()


    }

    parseCategories(raw: Selectable<Categories>[]): CategoriesSchemaType {

        const parsedCategories = [];

        for (const category of raw) {
            let { id, icon, name, slug } = category

            let parsed = {
                id: id,
                name: name,
                slug: slug,
                icon: icon
            };

            parsedCategories.push(parsed)

        }

        CategoriesValidator.Check(parsedCategories);

        return parsedCategories
    }


}