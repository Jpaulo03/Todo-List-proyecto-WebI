require("dotenv").config();


const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const mysql = require("mysql2/promise");
const { body, param, validationResult } = require("express-validator");

const app = express();

const PORT = process.env.PORT || 3000;

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

function validar(req) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = new Error("Validacion fallida");
        err.status = 400;
        err.details = errors.array();
        throw err;
    }
}

app.post("/api/todos", [
    body("title").isString().notEmpty().withMessage("El titulo es obligatorio")
], async (req, res, next) => {
    try{
        validar(req);
        const { title } = req.body;
        const [result] = await pool.query(
            "INSERT INTO tareas (title, completed) VALUES (?, ?)",
            [title, false]
        );
        res.status(201).json({
            data: { id: result.insertId, title: title, completed: false },
            error: null
        });
    } catch (e) {
        next (e);
    }
});

app.get("/api/todos", async (req, res, next) => {
    try{
        const [rows] = await pool.query("SELECT id, title, completed FROM tareas ORDER BY id DESC");
        res.json ({
            data: rows,
            error: null
        });
    } catch (e){
        next(e);
    }
});

app.put("/api/todos/:id", [
    param("id").isInt({ min: 1 }).withMessage("ID inválido"),
    body("completed").isBoolean().withMessage("Debe ser un valor booleano (true/false)")
], async (req, res, next) => {
    try {
        validar(req);
        const { id } = req.params; 
        const { completed } = req.body; 

        const [result] = await pool.query(
            "UPDATE tareas SET completed = ? WHERE id = ?",
            [completed ? 1 : 0, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ data: null, error: { message: "Tarea no encontrada" } });
        }

        res.json({ data: { message: "Tarea actualizada correctamente" }, error: null });
    } catch (e) {
        next(e);
    }
});

app.delete("/api/todos/:id", [
    param("id").isInt({ min: 1 }).withMessage("ID inválido")
], async (req, res, next) => {
    try {
        validar(req);
        const { id } = req.params;

        const [result] = await pool.query("DELETE FROM tareas WHERE id = ?", [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ data: null, error: { message: "Tarea no encontrada" } });
        }

        res.json({ data: { message: "Tarea eliminada" }, error: null });
    } catch (e) {
        next(e);
    }
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({
        data: null,
        error: {
            message: err.message || "Error interno del servidor",
            details: err.details || []
        }
    });
});


app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});