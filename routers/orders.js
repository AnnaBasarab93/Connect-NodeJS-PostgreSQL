import express from 'express';
import { check, validationResult } from 'express-validator';
const ordersRouter = express.Router();
import pool from '../db/pool.js';

//GET  /  : To get all the orders 

ordersRouter.get("/", async(req, res) => {
try{
        const {rows} = await pool.query('SELECT * FROM orders');
        res.json(rows)
}catch(error) {
        res.status(500).json(error)
    }
})

//GET  /:id :  To get one order (with the id) 

ordersRouter.get("/:id", async (req, res) => {
        const {id} = req.params;
try{
        const {rows} = await pool.query('SELECT * FROM orders WHERE id=$1;', [id])
        res.json(rows[0])

}catch(error){
        res.status(500).json(error)
    }
})

//POST / -> To create a new order

ordersRouter.post("/",[
        check('price').notEmpty().isInt(),
        check('date').notEmpty().isDate(),
], async (req, res) => {
    const errors = validationResult(req);
if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    };

        const {price, date} = req.body;
try{
        const {rows} = await pool.query('INSERT INTO orders(price, date) VALUES($1, $2) RETURNING *;', [price, date]);
        res.json(rows[0])
}catch(err){
        res.status(500).json(err)
    }
})

//PUT /:id  :  To edit one order (with the id) 

ordersRouter.put("/:id", [
        check('price').notEmpty().isInt(),
        check('date').notEmpty().isDate(),
], async (req, res) => {
    const errors = validationResult(req);
if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    };

        const {price, date} = req.body;
        const {id} = req.params;
try{
        const {rows} = await pool.query('UPDATE orders SET price=$1, date=$2 WHERE id=$4 RETURNING *;', [price, date, id]);
        res.json(rows[0])

}catch(err){
        res.status(500).json(err)
    }
})


//DELETE  /:id : To delete one order (with the id) 

ordersRouter.delete("/:id", async (req, res) => {
        const {id} = req.params;
try{
        const {rows} = await pool.query('DELETE FROM orders WHERE id=$1 RETURNING *;', [id]);
        res.json(rows[0])

}catch(err){
        res.status(500).json(err)
    }
})


export default ordersRouter;