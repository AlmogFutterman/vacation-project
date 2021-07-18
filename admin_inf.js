const bcrypt = require("bcrypt")

const hashpass = bcrypt.hashSync("1234", 10)

console.log(hashpass);

// admin
// 1234

// user
// 1234