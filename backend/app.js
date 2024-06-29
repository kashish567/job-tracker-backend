const express = require("express")
const dotenv = require("dotenv")
const mongoose = require("mongoose")

dotenv.config()
const app = express()

return Promise.resolve()
    .then(() => {
        // mongodb init
        return mongoose.connect(process.env.MONGO_URI, {})
            .then(connection => {
                console.log("mongo db connection established")
                // console.log("Connection: ", connection.connection.db)
            })
    })
    .then(() => {
        // add middlewares
        app.use(express.json())
        app.use(express.urlencoded({ extended: true }))

        // custom middleware
        app.use((req, res, next) => {
            console.log(`API Logging --- METHOD: ${req.method} URL: ${req.originalUrl} BODY: ${req.body ? JSON.stringify(req.body) : "Empty"}`)
            next()
        })
    })
    .then(() => {
        app.get("/", (req, res) => {
            return res.send("Greetings! Welcome to Job Tracker API.")
        })

        app.post("/auth/register", (req, res) => {
            return res.send("Registered successfully.")
        })
    })
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`job tracker api is running on port ${process.env.PORT}`)
        })
    })
    .catch(error => {
        console.log("job tracker api start error")
        console.log("Error: ", error)
        process.exit(1)
    })