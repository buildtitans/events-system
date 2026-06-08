import type { CategoriesSchemaType } from "@/src/schemas/groups/categoriesSchema";
export type CategoryMap = Map<string, string>;

export function seedCategoryMap(categories: CategoriesSchemaType): CategoryMap {
  const map: CategoryMap = new Map();
  categories.forEach((category) => {
    map.set(category.id, category.name);
  });
  return map;
}
