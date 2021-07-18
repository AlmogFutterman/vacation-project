const express = require("express")
const app = express()
require("./dbconnection")


require("dotenv").config()
const port = process.env.PORT

app.use(require("cors")())
app.use(express.json())

app.use("/users", require("./routes/users"))
app.use("/data", require("./routes/data"))




app.listen(port, () => {
    console.log(`rockin' ${port}`)
})