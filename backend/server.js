const app = require('./app.js')
const mongoose = require('mongoose')
require('dotenv').config()

const PORT = process.env.PORT || 3000

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to the database!");
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    })
    .catch((error) => {
        console.log("Cannot connet to the database!", error)
        process.exit();
    })