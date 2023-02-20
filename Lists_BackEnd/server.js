// Description: This is the main server file for the deeds app
// bring in environment variables from a .env file
require("dotenv").config()
// import express and morgan
express = require("express")
morgan = require("morgan")
// create an application object
const app = express()
// define a PORT variable from the environment with a default value
const PORT = process.env.PORT || 4000
app.use(morgan("tiny"))// log requests to the console
app.use(express.json()) // middleware for parsing incoming json
app.use(express.urlencoded({extended: true})) //middleware for parsing urlencoded data
// app.use("/static", express.static("static")) // to set a folder for static file serving
// import the dbconnection module
const dbconnect = require("./dbconfig/dbconnection")
const cors = require('cors')


// import the deedsRouter
const deedsRouter = require("./routes/deedsRouter")

app.use('/*', body('*').trim().escape())


app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? 'https://lists-fullstack-mern-project-backend.vercel.app' : 'http://localhost:3000',
    credentials: true,
    preflightContinue: true,
    // "methods": "GET,HEAD,PUT,PATCH,POST,DELETE, OPTIONS"
}))
// app.options(cors());

app.use('/deeds',deedsRouter)

// middleware for handling 404 errors
// app.use((req, res) => {
//     res.status(404).send("404: Page Not Found")
// })
//
// middleware for handling 500 errors
// app.use((err, req, res, next) => {
//     console.error(err.stack)
//     res.status(500).send("500: Internal Server Error")
// })

// mount the deedsRouter at the /deeds path

// connect to the database
dbconnect()



// Server Listener
app.listen(PORT, () => console.log(`Listening on port ${PORT}`))

module.exports = app;

