const express = require('express')
const movies = require('./movies.json')
const crypto = require('node:crypto')
const { validateMovie, validatePartialMovie } = require('./movies')
const app = express()

app.use(express.json())
app.disable('x-powered-by')

app.get('/',(req,res)=>{
    res.json({mensaje: 'Hola mundo'})
})

// // Recuperar las peliculas
// app.get('/movies',(req,res)=>{
    //     res.json(movies)
    // })
    
    
    // Recuperar las peliculas por genero
    // :id significa que es un segmento dinamico osea que se pasa por parametro como el id
    app.get('/movies/:id',(req,res)=>{
    const { id } = req.params
    const movief = movies.find(movie => movie.id === id)
    if (movief){
        return res.json(movief)
    }
    res.status(404).json({mensaje : "No se encontro la película"})
})


//filtrar por genero
app.get('/movies',(req,res)=>{
    // dar permiso de CORS
    res.header('Access-Control-Allow-Origin',"*")  
    const { genere } = req.query
    if (genere){
        const filterMovies = movies.filter(movie => movie.genre.some(g => g.toLowerCase() === genere.toLowerCase()))
        return res.json(filterMovies)
    }else return res.json(movies)
})

//crear pelicula
app.post('/movies',(req,res)=>{
    const result = validateMovie(req.body)
    
    if (result.error){
        return res.status(400).json({ error: JSON.parse(result.error.message) })
    }
    const newMovie = {
        id: crypto.randomUUID(),
        ...result.data
    }
    movies.push(newMovie)
    res.status(201).json(newMovie)
})

// eliminar peliculas
app.delete('/movies/:id',(req,res)=>{
    res.header('Access-Control-Allow-Origin',"*")  
    const { id } = req.params
    const movieIndex = movies.findIndex(movie => movie.id === id)
    if (movieIndex === -1 ) {
        return res.status(404).json({mensaje : "No se encontro la película"})
    }
    movies.splice(movieIndex,1)
    
    return res.json({mensaje: "movie deleted"})
})


// actualizar una pelicula utilizando el patch
app.patch('/movies/:id',(req,res)=>{
    const result = validatePartialMovie(req.body)
    if (!result.success) {
        return res.status(400).json({ error: JSON.parse(result.error.message) })
    }
    
    const { id } = req.params
    const movieIndex = movies.findIndex(movie => movie.id === id)
    if (movieIndex === -1 ) {
        return res.status(404).json({mensaje : "No se encontro la película"})
    }
    const movieUpdate = {
        ...movies[movieIndex],
        ...result.data
    }
    
    movies[movieIndex] = movieUpdate
    
    return res.json(movieUpdate)
    
})

app.options('/movies/:id',(req,res)=>{
    res.header('Access-Control-Allow-Origin',"*")  
    res.header('Access-Control-Allow-Methods','GET, POST, PATCH, DELETE')
    res.send(200)
})
const PORT = process.env.PORT ?? 3000
app.listen(PORT,()=>{
    console.log(`Server listening on port http://localhost:${PORT}`)
})