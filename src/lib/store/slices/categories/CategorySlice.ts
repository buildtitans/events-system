import { CategoryLookupType } from "@/src/lib/utils/helpers/categories/createCategoryLookup";
import { CategoriesSchemaType } from "@/src/schemas/groups/categoriesSchema";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type CatLookupState = { status: 'initial' } | { status: 'ready', data: CategoryLookupType };

type CategoriesSliceInitialState = {
    categories: CategoriesSchemaType,
    categoryLookup: CatLookupState
}

const initialState: CategoriesSliceInitialState = {
    categories: [],
    categoryLookup: { status: "initial" }
}

const CategoriesSlice = createSlice({
    name: "Categories",
    initialState: initialState,
    reducers: {
        getAllCategories: (state: CategoriesSliceInitialState, action: PayloadAction<CategoriesSchemaType>) => {
            state.categories = action.payload;
        },
        getCatLookup: (state: CategoriesSliceInitialState, action: PayloadAction<CatLookupState>) => {
            state.categoryLookup = action.payload;
        }
    }
})


export const {
    getAllCategories,
    getCatLookup
} = CategoriesSlice.actions;

export default CategoriesSlice.reducer;

export type CategoriesSliceType = ReturnType<typeof CategoriesSlice.reducer>
