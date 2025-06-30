// archivo: index.js
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Crear base de datos en memoria (o persistente si prefieres)
    const db = new sqlite3.Database(":memory:", (err) => {
    if (err) console.error(err.message);
    else console.log("Conectado a la base de datos SQLite en memoria");
    });

// Crear tabla y datos de prueba
db.serialize(() => {
    db.run("CREATE TABLE usuarios (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre TEXT, email TEXT)");
    db.run("INSERT INTO usuarios (nombre, email) VALUES ('juan', 'juan@example.com')");
    db.run("INSERT INTO usuarios (nombre, email) VALUES ('ana', 'ana@example.com')");
});

// Ruta vulnerable a SQL Injection
app.get("/buscar", (req, res) => {
    const nombre = req.query.nombre;
    const consulta = `SELECT * FROM usuarios WHERE nombre = '${nombre}'`;
    console.log("Consulta ejecutada:", consulta);

    db.all(consulta, [], (err, rows) => {
        if (err) {
        console.error(err.message);
        return res.status(500).send("Error en la consulta");
        }
        res.json(rows);
    });
    });

app.get("/", (req, res) => {
  res.send("API activa. Usa /buscar?nombre=juan para probar.");
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
