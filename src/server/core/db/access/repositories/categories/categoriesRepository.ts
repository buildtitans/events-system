import { validateOrThrow } from "@/src/schemas/validateOrThrow";
import {
  CategoriesSchema,
  type CategoriesSchemaType,
} from "@/src/schemas/groups/categoriesSchema";
import { Kysely } from "kysely";
import type { Categories, DB } from "../../../types/db";
import type { Selectable } from "kysely";

export interface ICategoriesRepository {
  getCategories(): Promise<CategoriesSchemaType>;
}

export class CategoriesRepository implements ICategoriesRepository {
  constructor(private readonly db: Kysely<DB>) {}

  async getCategories(): Promise<CategoriesSchemaType> {
    const raw = await this.getAllCategories();
    return this.parseCategories(raw);
  }

  private async getAllCategories(): Promise<Selectable<Categories>[]> {
    return await this.db
      .selectFrom("categories")
      .selectAll()
      .orderBy("categories.name")
      .execute();
  }

  private parseCategories(raw: Selectable<Categories>[]): CategoriesSchemaType {
    return validateOrThrow(CategoriesSchema, raw);
  }
}
