const mysql = require("mysql")

const con = mysql.createConnection({
    host: "sql4.freemysqlhosting.net",
    user: "sql4426280",
    password: "ML5A9DMvFC",
    database: "sql4426280"
})

con.connect((err) => {
    if (err) {
        console.log(err);
    }else {
        console.log("connected to mySql");
    }
})

const myQuery = (q) => {
    return new Promise ((resolve, reject) => {
        con.query(q, (err,results) => {
            if (err) {
                reject(err)
            } else {
                resolve (results)
            }
        })
    })
}


module.exports = { myQuery }