import type { CategoriesSchemaType } from "@/src/schemas/groups/categoriesSchema";
import type { SyncDomainsType } from "@/src/lib/types/server/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initializeDomains } from "../rendering/RenderingSlice";

type CategoriesSliceInitialState = {
  categories: CategoriesSchemaType;
};

const initialState: CategoriesSliceInitialState = {
  categories: [],
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
        }
      },
    );
  },
});

export const { getAllCategories } = CategoriesSlice.actions;

export default CategoriesSlice.reducer;

export type CategoriesSliceType = ReturnType<typeof CategoriesSlice.reducer>;
