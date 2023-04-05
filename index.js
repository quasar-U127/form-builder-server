const cors = require("cors");
const express = require("express")
const mongoose = require("mongoose") // new
const routes = require("./routes")
// Connect to MongoDB database
var argv = require('minimist')(process.argv.slice(2));
// console.log(argv)
var mongoServer = "localhost:27017"
if ("mongo-server" in argv) {
    mongoServer = argv["mongo-server"]
}
console.log(mongoServer)
const app = express()
app.use(cors());
app.use(express.json())
app.use("/api", routes)
mongoose
    .connect("mongodb://" + mongoServer + "/sources", { useNewUrlParser: true })
    .then(() => {

        // console.log("Connected to mongodb")
    })
var server = app.listen(5000, () => {
    // console.log("Server has started at 5000!")
})


module.exports = { app, server }