const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;

// Configuración de la base de datos
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'musica',
    password: '1234',
    port: 5432,
});

app.use(cors());
app.use(bodyParser.json());

// Ruta de registro
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await pool.query('SELECT * FROM users WHERE username = $1 OR email = $2', [username, email]);
    if (existingUser.rowCount > 0) {
        return res.status(400).json({ message: 'Usuario o correo ya existe' });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Guardar el nuevo usuario en la base de datos
    await pool.query('INSERT INTO users (username, email, password) VALUES ($1, $2, $3)', [username, email, hashedPassword]);
    res.status(201).json({ message: 'Usuario registrado con éxito' });
});

// Ruta de inicio de sesión
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Aquí deberías buscar al usuario en la base de datos y validar la contraseña
    const user = await User.findOne({ email });
    if (!user || !(await user.validatePassword(password))) {
        return res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
    }

    // Aquí, podrías crear un token o manejar la sesión como desees
    const token = 'tu_token_aqui'; // Genera un token JWT u otro mecanismo
    res.json({ success: true, token });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
