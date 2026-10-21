import {
  CategoryLookupType,
} from "@/src/lib/utils/helpers/categories/createCategoryLookup";
import type { CategoriesSchemaType } from "@/src/schemas/groups/categoriesSchema";
import type { SyncDomainsType } from "@/src/lib/types/server/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initializeDomains } from "../rendering/RenderingSlice";

type CatLookupState =
  | { status: "initial" }
  | { status: "ready"; data: CategoryLookupType };

type CategoriesSliceInitialState = {
  categories: CategoriesSchemaType;
  categoryLookup: CatLookupState;
};

const initialState: CategoriesSliceInitialState = {
  categories: [],
  categoryLookup: { status: "initial" },
};

const CategoriesSlice = createSlice({
  name: "Categories",
  initialState: initialState,
  reducers: {
    getAllCategories: (
      state: CategoriesSliceInitialState,
      action: PayloadAction<CategoriesSchemaType>,
    ) => {
      state.categories = action.payload;
    },
    getCatLookup: (
      state: CategoriesSliceInitialState,
      action: PayloadAction<CatLookupState>,
    ) => {
      state.categoryLookup = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      initializeDomains,
      (
        state: CategoriesSliceInitialState,
        action: PayloadAction<SyncDomainsType>,
      ) => {
        const result = action.payload;

        if (result.status === "fulfilled") {
          state.categories = result.data.categories;
          const lookup: CategoryLookupType = {};
          for (const category of result.data.categories) {
            lookup[category.id] = result.data.groups
              .filter(({ meta }) => meta.category_name === category.name)
              .map(({ group }) => group.id);
          }
          state.categoryLookup = {
            status: "ready",
            data: lookup,
          };
        }
      },
    );
  },
});

export const { getAllCategories, getCatLookup } = CategoriesSlice.actions;

export default CategoriesSlice.reducer;

export type CategoriesSliceType = ReturnType<typeof CategoriesSlice.reducer>;
