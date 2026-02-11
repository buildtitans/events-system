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

    private async getAllCategories(): Promise<Selectable<Categories>[]> {

        return await this.db
            .selectFrom("categories")
            .selectAll()
            .orderBy("categories.name")
            .execute()
    };

    private parseCategories(raw: Selectable<Categories>[]): CategoriesSchemaType {
        const parsed = raw;
        CategoriesValidator.Check(parsed);
        return parsed
    }


}