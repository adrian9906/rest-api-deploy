const z = require('zod')

const moviesSchema = z.object({
    title: z.string({
        invalid_type_error: "Movie title must be a string",
        required_error: "Movie title is required"
    }),
    year: z.number().int().min(1900).max(2024),
    duration: z.number().int().positive(),
    director: z.string(),
    rate: z.number().min(0).max(10).optional(),
    poster: z.string().url(),
    genre: z.array(z.enum(["Action","Comedy","Drama","Adventure","Fantasy","Horror","Thriller"]))

})

function validateMovie(object){
    return  moviesSchema.safeParse(object)
}


function validatePartialMovie(object){
    return moviesSchema.partial().safeParse(object)
}
module.exports = {
    validateMovie,
    validatePartialMovie
}