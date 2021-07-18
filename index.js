const express = require("express")
const app = express()
const path = require('path')
require("./dbconnection")

app.use('/', express.static(path.join(__dirname, "build")))

require("dotenv").config()
const port = process.env.PORT

app.use(require("cors")())
app.use(express.json())

app.use("/users", require("./routes/users"))
app.use("/data", require("./routes/data"))

app.get('/', (req,res)=>res.sendFile(__dirname+"/build/index.html"))



app.listen(port, () => {
    console.log(`rockin' ${port}`)
})