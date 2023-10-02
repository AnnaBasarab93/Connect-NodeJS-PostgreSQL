import express from 'express';
const usersRouter = express.Router();
import { check, validationResult } from 'express-validator';
import  pool from '../db/pool.js';

//GET  /  : To get all the users 

usersRouter.get("/", async(req, res) => {
try{
        const {rows} = await pool.query('SELECT * FROM users');
        res.json(rows)
}catch(error) {
        res.status(500).json(error)
    }
})

// GET  /:id :  To get one user (with the id) 
usersRouter.get("/:id", async (req, res) => {
        const {id} = req.params;
try{
        const user = await pool.query('SELECT * FROM users WHERE id=$1;', [id])
if(user.rows.length > 0){
        const {rows} = await pool.query('SELECT * FROM users WHERE id=$1;', [id])
        res.json(rows[0])
}else{
        res.status(404).json({message : "User doesn't found"})
    }
            
}catch(error){
        res.status(500).json(error)
    }
})

//POST / -> To create a new user 

usersRouter.post("/",[
        check('first_name').notEmpty().isString(),
        check('last_name').notEmpty().isString(),
        check('age').notEmpty().isInt({min:1}),
], async (req, res) => {
        const errors = validationResult(req);
if(!errors.isEmpty()){
        res.status(400).json({ errors: errors.array() });
    };

        const {first_name, last_name, age} = req.body;
try{
        const {rows} = await pool.query('INSERT INTO users(first_name, last_name, age) VALUES($1, $2, $3) RETURNING *;', [first_name, last_name, age]);
        res.json(rows[0])

}catch(err){
        res.status(500).json(err)
    }
})

//PUT /:id  :  To edit one user (with the id) 

usersRouter.put("/:id",[
        check('first_name').notEmpty().isString(),
        check('last_name').notEmpty().isString(),
        check('age').notEmpty().isInt({min :1}),
], async (req, res) => {
        const errors = validationResult(req);
if(!errors.isEmpty()){
        res.status(400).json({ errors: errors.array() })
    };

        const {first_name, last_name, age} = req.body;
        const {id} = req.params;
try{
        const chechUsers = await pool.query ('SELECT * FROM users WHERE id=$1;', [id])
if(chechUsers.rows.length > 0){
        const {rows} = await pool.query('UPDATE users SET first_name=$1, last_name=$2, age=$3  WHERE id=$4 RETURNING *;', [first_name, last_name, age, id]);
        res.json(rows[0])
}else {
        res.status(404).json({message : "User doesn't found"})
    }

}catch(err){
        res.status(500).json(err)
    }
})

//DELETE  /:id : To delete one order (with the id) 

usersRouter.delete("/:id", async (req, res) => {
        const {id} = req.params;
try{
        const findUser = await pool.query('SELECT * FROM users WHERE id=$1;', [id])
if(findUser.rows.length > 0){
        const {rows} = await pool.query('SELECT * FROM users WHERE id=$1;', [id])
        res.json(rows[0])
}else{
        res.status(404).json({message : "User doesn't found"})
    }
}catch(err){
        res.status(500).json(err)
    }
})
//GET /:id/orders : To get all orders linked to a specific user

usersRouter.get("/:id/orders", async (req, res) => {
        const {id} = req.params;
try{
        const {rows} = await pool.query('SELECT * FROM orders WHERE user_id=$1;', [id])
        res.json(rows[0])
}catch(err) {
        res.status(500).json(err)
    }
})


//PUT /:id/check-inactive

usersRouter.put('/:id/check-inactive', async (req, res) => {
        const {id} = req.params;
try{
        const checkOrders = await pool.query('SELECT * FROM orders WHERE user_id=$1;', [id]);
if(!checkOrders.user_id){
        const {rows} = await pool.query ('UPDATE users SET active=false WHERE id=$1 RETURNING *;', [id])
        res.json(rows[0])
}else{
        res.status(400).json({message: "User has already orders"});
        }
}catch(err) {
        res.status(500).json(err)
    }
})



export default usersRouter;