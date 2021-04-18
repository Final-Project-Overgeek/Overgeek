if (process.env.NODE_ENV !== 'production') require("dotenv").config();
const express = require("express")
const app = express();
const routes = require("./routes/index")
const cors = require("cors")
const errorHandler = require("./middlewares/errorHandler")

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(routes)
app.use(errorHandler)

module.exports = app
