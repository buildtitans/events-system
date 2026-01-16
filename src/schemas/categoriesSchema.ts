import { Type, Static } from "@sinclair/typebox";
import { TypeCompiler } from "@sinclair/typebox/compiler";

export const CategorySchema = Type.Object({
    icon: Type.String(),
    id: Type.String(),
    name: Type.String(),
    slug: Type.String(),
});

export const CategoriesSchema = Type.Array(CategorySchema);

export type CategorySchema = Static<typeof CategorySchema>;

export type CategoriesSchemaType = Static<typeof CategoriesSchema>;

export const CategoriesValidator = TypeCompiler.Compile(CategoriesSchema);


export const GetAllCategoriesResponse = Type.Object({
    items: CategoriesSchema,
    meta: Type.Object({
        total: Type.Number(),
        error: Type.Union([Type.String(), Type.Null()]),
        message: Type.String()
    })
});


export type GetAllCategoriesResponseType = Static<typeof GetAllCategoriesResponse>;

export const GetAllCategoriesResponseValidator = TypeCompiler.Compile(GetAllCategoriesResponse);

