import { CategoriesSchemaType } from "@/src/schemas/groups/categoriesSchema";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type CategoriesSliceInitialState = {
    categories: CategoriesSchemaType
}

const initialState: CategoriesSliceInitialState = {
    categories: []
}

const CategoriesSlice = createSlice({
    name: "Categories",
    initialState: initialState,
    reducers: {
        getAllCategories: (state: CategoriesSliceInitialState, action: PayloadAction<CategoriesSchemaType>) => {
            state.categories = action.payload;
        }
    }
})


export const { getAllCategories } = CategoriesSlice.actions;

export default CategoriesSlice.reducer;

export type CategoriesSliceType = ReturnType<typeof CategoriesSlice.reducer>
