const express = require('express');
const paypal = require('@paypal/checkout-server-sdk'); 
const mysql = require('mysql');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json()); // Middleware para parsear JSON

// Configuración de MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '120705Yaz',
  database: 'mi_base_de_datos',
});

connection.connect((err) => {
  if (err) {
    console.error('Error al conectar con MySQL:', err.stack);
    return;
  }
  console.log('Conexión a MySQL exitosa');
});

// Middleware
app.use(cors());
app.use(express.static(path.join(__dirname, '/')));

// Ruta para registrar usuarios
app.post('/registro', (req, res) => {
  const { nombre, apellido, usuario, contraseña } = req.body;

  const query = 'INSERT INTO usuarios (nombre, apellido, usuario, contraseña) VALUES (?, ?, ?, ?)';
  connection.query(query, [nombre, apellido, usuario, contraseña], (error, results) => {
    if (error) {
      res.status(500).send('Error al registrar usuario en MySQL: ' + error.message);
    } else {
      res.status(200).send('Usuario registrado correctamente en MySQL');
    }
  });
});

// Ruta para login
app.post('/login', (req, res) => {
  const { usuario, contraseña } = req.body;

  const query = 'SELECT * FROM usuarios WHERE usuario = ?';
  connection.query(query, [usuario], (error, results) => {
    if (error) {
      res.status(500).send('Error al iniciar sesión en MySQL: ' + error.message);
    } else if (results.length === 0) {
      res.status(404).send('Usuario no encontrado');
    } else if (results[0].contraseña !== contraseña) {
      res.status(401).send('Contraseña incorrecta');
    } else {
      res.status(200).send('Inicio de sesión exitoso en MySQL');
    }
  });
});

// Ruta para servir el archivo HTML (mapa.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/mapa.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'mapa.html'));
});

// Iniciar servidor en el puerto 3000
app.listen(3000, () => {
  console.log('Servidor Node.js corriendo en http://localhost:3000');
});
