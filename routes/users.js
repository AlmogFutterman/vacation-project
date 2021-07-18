const router = require("express").Router()
const { myQuery } = require("../dbconnection")
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')

// register
router.post("/register", async (req, res) => {
    try {
        const {username, f_name, l_name, password} = req.body
        const ver = await myQuery(`SELECT * FROM users WHERE username='${username}'`)
        console.log(ver);
        console.log(ver[0].username);
        if (ver[0].username == username) {
            return res.status(403).send('user already exists')
        }
        if (!username || !f_name || !l_name || !password){
            return res.status(400).send("missing some info")
        }
        const b_password = await bcrypt.hashSync(password, 10)
        await myQuery(`INSERT INTO users (username, f_name, l_name, b_password) 
        VALUES ('${username}', '${f_name}', '${l_name}', '${b_password}')`)
        const dbdata = await myQuery(`SELECT id, username, f_name, l_name, b_password, auth_type FROM users WHERE username='${username}'`)
        jwt.sign(
            {
                id:dbdata[0].id,
                username:dbdata[0].username,
                f_name:dbdata[0].f_name,
                l_name:dbdata[0].l_name,
                type:dbdata[0].auth_type
            },
            process.env.JWT_CODE,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) {
                    return res.status(500).send(err)
                }
                // res.send({token})
                res.status(200).send({token})
            }
        )
    }
    catch (err) {
        res.status(500).send(err)
    }
})

// login
router.post("/login", async (req, res) => {
    try{
        const {username, password} = req.body
        if (!username || !password) {
            return res.status(400).send({err:"missing some info"});
        }
        const dbdata = await myQuery(`SELECT id, username, f_name, l_name, b_password, auth_type FROM users WHERE username='${username}'`)
        console.log(dbdata);
        const match = await bcrypt.compareSync(password, dbdata[0].b_password)
        if(match) {
            // make token
            jwt.sign(
                {
                    id:dbdata[0].id,
                    username:dbdata[0].username,
                    f_name:dbdata[0].f_name,
                    l_name:dbdata[0].l_name,
                    type:dbdata[0].auth_type
                },
                process.env.JWT_CODE,
                { expiresIn: '1h' },
                (err, token) => {
                    if (err) {
                        return res.status(500).send(err)
                    }
                    // res.send({token})
                    res.status(200).send({token})
                }
            )
        }else{
            return res.status(401).send("username/password not found")
        }
    }
    catch (err) {

        res.status(500).send(err)
    }
})


module.exports = router