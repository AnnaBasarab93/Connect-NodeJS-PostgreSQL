import express from 'express';
const ordersRouter = express.Router();
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool();

//GET  /  : To get all the orders 

ordersRouter.get("/", async(req, res) => {
    try{
        const {rows} = await pool.query('SELECT * FROM orders');
        console.log(rows)
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

ordersRouter.post("/", async (req, res) => {
    const {price, date, user_id} = req.body;
    try {
        const {rows} = await pool.query('INSERT INTO orders(price, date, user_id) VALUES($1, $2, $3) RETURNING *;', [price, date, user_id]);
        res.json(rows[0])

    } catch(err){
        res.status(500).json(err)
    }
})

//PUT /:id  :  To edit one order (with the id) 

ordersRouter.put("/:id", async (req, res) => {
    const {price, date, user_id} = req.body;
    const {id} = req.params;
    try {
        const {rows} = await pool.query('UPDATE orders SET price=$1, date=$2, user_id=$3  WHERE id=$4 RETURNING *;', [price, date, user_id, id]);
        res.json(rows[0])

    } catch(err){
        res.status(500).json(err)
    }
})


//DELETE  /:id : To delete one order (with the id) 

ordersRouter.delete("/:id", async (req, res) => {
    const {id} = req.params;
    try {
        const {rows} = await pool.query('DELETE FROM orders WHERE id=$1 RETURNING *;', [id]);
        res.json(rows[0])

    } catch(err){
        res.status(500).json(err)
    }
})


export default ordersRouter;