import z from "zod";


const AuthorSchema = z.object({ name: z.string(), avatar: z.string() });
const AuthorsSchema = z.array(AuthorSchema);


export { AuthorsSchema, AuthorSchema }