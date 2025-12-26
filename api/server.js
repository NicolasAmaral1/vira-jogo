const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database Connection
const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'postgres',
    database: process.env.DB_NAME || 'vira_db',
    password: process.env.DB_PASSWORD || 'vira_secret_pass',
    port: 5432,
});

// Secret for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'vira_super_secret_key_123';

// Create Table on Start
const initDB = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                birth_date DATE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("Tabela 'users' verificada/criada com sucesso.");
    } catch (err) {
        console.error("Erro ao iniciar DB:", err);
    }
};

// Wait for DB to come up effectively (simple retry logic could be added here, but Docker restart policy helps)
setTimeout(initDB, 5000); 

// Routes

// REGISTER
app.post('/register', async (req, res) => {
    const { name, email, password, birthDate } = req.body;

    if (!name || !email || !password || !birthDate) {
        return res.status(400).json({ error: "Todos os campos são obrigatórios." });
    }

    // Age Check
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
    }

    if (age < 16) {
        return res.status(403).json({ error: "É necessário ter 16 anos ou mais para jogar." });
    }

    try {
        // Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert User
        const result = await pool.query(
            'INSERT INTO users (name, email, password, birth_date) VALUES ($1, $2, $3, $4) RETURNING id, name, email',
            [name, email, hashedPassword, birthDate]
        );

        // Generate Token
        const user = result.rows[0];
        const token = jwt.sign({ id: user.id, name: user.name }, JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({ message: "Usuário criado com sucesso!", token, user: { name: user.name, email: user.email } });

    } catch (err) {
        if (err.code === '23505') { // Unique violation
            return res.status(409).json({ error: "Email já cadastrado." });
        }
        console.error(err);
        res.status(500).json({ error: "Erro interno do servidor." });
    }
});

// LOGIN
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email e senha são obrigatórios." });
    }

    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        
        if (result.rows.length === 0) {
            return res.status(401).json({ error: "Credenciais inválidas." });
        }

        const user = result.rows[0];
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(401).json({ error: "Credenciais inválidas." });
        }

        const token = jwt.sign({ id: user.id, name: user.name }, JWT_SECRET, { expiresIn: '7d' });

        res.json({ message: "Login realizado!", token, user: { name: user.name, email: user.email } });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro interno do servidor." });
    }
});

// VERIFY TOKEN (Optional helper)
app.get('/verify', (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ valid: false });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ valid: false });
        res.json({ valid: true, user });
    });
});

app.listen(port, () => {
    console.log(`API rodando na porta ${port}`);
});
