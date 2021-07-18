const router = require("express").Router()
const { myQuery } = require("../dbconnection")
const veruser = require('../helpers/veruser')
const veradmin = require('../helpers/veradmin')

// user===========================================================
// get vacations (group by follows using req.user.id)

router.get('/', veruser, async (req,res) => {
    try{
        console.log(req.user.id);
        const dbdata = await myQuery(`SELECT vacations.*, refval.user_id, COUNT(refval.user_id) AS follows
        FROM vacations
        LEFT JOIN refval
        ON vacation_id= vacations.id AND user_id=${req.user.id}
        GROUP BY vacations.id
        ORDER BY user_id DESC`)
        res.status(200).send({dbdata})
    }
    catch (error) {
       res.status(500).send(error)
    }
})


// get follow/un-follow vacation

router.get('/follow/:vacid', veruser, async (req,res) => {
    try{
        const dbdata = await myQuery(`SELECT * FROM refval WHERE user_id=${req.user.id} AND vacation_id=${req.params.vacid}`)
        console.log(dbdata[0]);
        console.log(!dbdata[0]);
        console.log('before condition');
        if (!dbdata[0]) {
            console.log('follow');
            await myQuery(`INSERT INTO refval (user_id, vacation_id) VALUES (${req.user.id}, ${req.params.vacid})`)
            res.status(201).send('followed successfully')
        } else {
            console.log('unfollow');
            // ==========================================================
            await myQuery(`DELETE FROM refval WHERE id=${dbdata[0].id}`)
            // ==========================================================
            res.status(204).send('unfollowed')
        }
    }
    catch(error){
        res.status(500).send(error)
    }
})



// admin======================================================
// post add vacation

router.post('/add', veradmin, async (req,res) => {
    try{
        await myQuery(`INSERT INTO vacations (description, destination, image, start_date, end_date, price) VALUES ('${req.body.description}','${req.body.destination}','${req.body.image}','${req.body.start_date}','${req.body.end_date}', ${req.body.price})`)
        res.status(201).send('vacation created successfully')
    }
    catch(error){
        res.status(500).send(error)
    }
})

// put edit vacation

router.put('/:vacation', veradmin, async (req,res) => {
    try{
        await myQuery(`UPDATE vacations SET description='${req.body.description}', destination='${req.body.destination}', image='${req.body.image}', start_date='${req.body.start_date}', end_date='${req.body.end_date}', price=${req.body.price} WHERE id=${req.params.vacation}`)
        res.status(200).send('updated')
    }
    catch (error) {
        res.status(500).send(error)
    }
})

// delete vacation

router.delete('/:vacation', veradmin, async (req,res) => {
    try{
        await myQuery(`DELETE FROM refval WHERE vacation_id=${req.params.vacation}`)
        await myQuery(`DELETE FROM vacations WHERE id=${req.params.vacation}`)
        res.status(204).send('vacation deleted')
    }
    catch (error) {
        console.log(error);
        res.status(500).send(error)
    }
})

// vacations for charts

router.get('/chart', veradmin, async (req,res) => {
    try{
        const dbdata = await myQuery(`SELECT vacations.*, COUNT(refval.user_id) AS follows
        FROM vacations
        LEFT JOIN refval
        ON vacation_id= vacations.id
        GROUP BY vacations.id
        ORDER BY follows DESC`)
        res.status(200).send({dbdata})
    }
    catch (error) {
        res.status(500).send(error)
    }
})


module.exports = router