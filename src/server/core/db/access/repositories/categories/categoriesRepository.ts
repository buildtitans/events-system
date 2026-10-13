import { validateOrThrow } from "@/src/schemas/validateOrThrow";
import {
  CategorySchema,
  CategoriesValidator,
  CategorySchemaType,
  type CategoriesSchemaType,
} from "@/src/schemas/groups/categoriesSchema";
import { Kysely } from "kysely";
import type { Categories, DB } from "../../../types/db";
import type { Selectable } from "kysely";

export interface ICategoriesRepository {
  getCategories(): Promise<CategoriesSchemaType>;
  getCategoryById(
    id: CategorySchemaType["id"],
  ): Promise<CategorySchemaType | undefined>;
}

export class CategoriesRepository implements ICategoriesRepository {
  constructor(private readonly db: Kysely<DB>) {}

  async getCategories(): Promise<CategoriesSchemaType> {
    const raw = await this.getAllCategories();
    return this.parseCategories(raw);
  }

  async getCategoryById(
    id: CategorySchemaType["id"],
  ): Promise<CategorySchemaType | undefined> {
    const raw = await this.getRawCategory(id);
    if (raw === undefined) return undefined;
    return this.validateCategory(raw);
  }

  private async getRawCategory(
    id: CategorySchemaType["id"],
  ): Promise<Selectable<Categories> | undefined> {
    return await this.db
      .selectFrom("categories")
      .selectAll()
      .where("id", "=", id)
      .limit(1)
      .executeTakeFirst();
  }

  private async getAllCategories(): Promise<Selectable<Categories>[]> {
    return await this.db
      .selectFrom("categories")
      .selectAll()
      .orderBy("categories.name")
      .execute();
  }

  private validateCategory(raw: unknown): CategorySchemaType {
    return validateOrThrow(CategorySchema, raw);
  }

  private parseCategories(raw: Selectable<Categories>[]): CategoriesSchemaType {
    const parsed = raw;
    CategoriesValidator.Check(parsed);
    return parsed;
  }
}
