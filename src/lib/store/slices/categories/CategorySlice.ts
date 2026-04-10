import {
  CategoryLookupType,
  createCategoryLookup,
} from "@/src/lib/utils/helpers/categories/createCategoryLookup";
import { CategoriesSchemaType } from "@/src/schemas/groups/categoriesSchema";
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
    builder.addCase(initializeDomains, (state, action) => {
      const result = action.payload;

      if (result.status === "fulfilled") {
        state.categories = result.data.categories;
        const lookup = createCategoryLookup(result.data.groups);
        state.categoryLookup = {
          status: "ready",
          data: lookup,
        };
      }
    });
  },
});

export const { getAllCategories, getCatLookup } = CategoriesSlice.actions;

export default CategoriesSlice.reducer;

export type CategoriesSliceType = ReturnType<typeof CategoriesSlice.reducer>;
