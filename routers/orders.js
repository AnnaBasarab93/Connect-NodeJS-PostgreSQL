import express from 'express';
import { check, validationResult } from 'express-validator';
const ordersRouter = express.Router();
import db from '../db/index.js';

//GET  /  : To get all the orders 

ordersRouter.get("/", async(req, res) => {
    try{
        const {rows} = await db.query('SELECT * FROM orders');
        res.json(rows)
    }catch(error) {
        res.status(500).json(error)
    }
})

//GET  /:id :  To get one order (with the id) 

ordersRouter.get("/:id", async (req, res) => {
    const {id} = req.params;
        try{
            const {rows} = await db.query('SELECT * FROM orders WHERE id=$1;', [id])
            res.json(rows[0])

        }catch(error){
        res.status(500).json(error)
    }
})

//POST / -> To create a new order

ordersRouter.post("/",[
    check('price').notEmpty().isInt(),
    check('date').notEmpty().isDate(),
    check('user_id').notEmpty().isInt(),
], async (req, res) => {
    const errors = validationResult(req);
        if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    };

    const {price, date, user_id} = req.body;
    try {
        const {rows} = await db.query('INSERT INTO orders(price, date, user_id) VALUES($1, $2, $3) RETURNING *;', [price, date, user_id]);
        res.json(rows[0])

    } catch(err){
        res.status(500).json(err)
    }
})

//PUT /:id  :  To edit one order (with the id) 

ordersRouter.put("/:id", [
    check('price').notEmpty().isInt(),
    check('date').notEmpty().isDate(),
    check('user_id').notEmpty().isInt(),
], async (req, res) => {
    const errors = validationResult(req);
        if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    };

    const {price, date, user_id} = req.body;
    const {id} = req.params;
    try {
        const {rows} = await db.query('UPDATE orders SET price=$1, date=$2, user_id=$3  WHERE id=$4 RETURNING *;', [price, date, user_id, id]);
        res.json(rows[0])

    } catch(err){
        res.status(500).json(err)
    }
})


//DELETE  /:id : To delete one order (with the id) 

ordersRouter.delete("/:id", async (req, res) => {
    const {id} = req.params;
    try {
        const {rows} = await db.query('DELETE FROM orders WHERE id=$1 RETURNING *;', [id]);
        res.json(rows[0])

    } catch(err){
        res.status(500).json(err)
    }
})


export default ordersRouter;