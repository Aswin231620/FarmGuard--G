const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

// --- RELEVANT FOR EXPO ---
// This server handles the core business logic of FarmGuard.
// It uses Express for API routing and SQLite for lightweight, local data storage.
// Authentication is handled via JWT (JSON Web Tokens) for secure communication.
const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = 'farmguard_secret_key_123'; // In a production app, this would be in a .env file

// Middleware
app.use(cors());
app.use(express.json());

// Initialize SQLite Database
// On Vercel, we must use /tmp for write access, but it is ephemeral!
const isVercel = process.env.VERCEL;
const dbDir = isVercel ? '/tmp' : __dirname;
const dbPath = path.join(dbDir, 'farmguard.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Database connection error:', err.message);
    } else {
        console.log('Connected to FarmGuard database.');
        initializeSchema();
    }
});

// Database Schema Initialization
function initializeSchema() {
    db.serialize(() => {
        // Users Table
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )`);

        // Farm Profiles
        db.run(`CREATE TABLE IF NOT EXISTS profiles (
            user_id INTEGER PRIMARY KEY,
            farm_type TEXT,
            location TEXT,
            animal_count INTEGER,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )`);

        // Risk Assessments
        db.run(`CREATE TABLE IF NOT EXISTS assessments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            score INTEGER,
            risk_level TEXT,
            date TEXT,
            responses TEXT,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )`);

        // Compliance Checklist
        db.run(`CREATE TABLE IF NOT EXISTS compliance (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            item_id TEXT,
            status BOOLEAN,
            last_updated TEXT,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )`);

        // Seed Sample Alerts (Only if table is empty)
        db.run(`CREATE TABLE IF NOT EXISTS alerts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            severity TEXT,
            description TEXT,
            date TEXT
        )`, () => {
            db.get("SELECT COUNT(*) as count FROM alerts", [], (err, row) => {
                if (row && row.count === 0) {
                    const stmt = db.prepare("INSERT INTO alerts (title, severity, description, date) VALUES (?, ?, ?, ?)");
                    stmt.run("Avian Influenza Outbreak", "High", "Detected in nearby poultry farm. Immediate biosecurity measures required.", new Date().toISOString());
                    stmt.run("African Swine Fever Alert", "Medium", "Increasing cases reported in the southern region.", new Date().toISOString());
                    stmt.run("New Biosecurity Protocol", "Low", "Updated guidelines for pig disinfection released.", new Date().toISOString());
                    stmt.finalize();
                }
            });
        });
    });
}

// Authentication Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Routes

// 1. Auth: Sign Up
app.post('/api/auth/signup', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.run(`INSERT INTO users (name, email, password) VALUES (?, ?, ?)`, [name, email, hashedPassword], function (err) {
            if (err) return res.status(400).json({ error: 'Email already exists' });
            res.json({ message: 'User created successfully', userId: this.lastID });
        });
    } catch (e) {
        res.status(500).json({ error: 'Server error' });
    }
});

// 2. Auth: Login
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
        if (err || !user) return res.status(400).json({ error: 'User not found' });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ error: 'Invalid password' });

        const token = jwt.sign({ id: user.id, name: user.name }, SECRET_KEY);
        res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
    });
});

// 3. Profile: Get/Update
app.get('/api/profile', authenticateToken, (req, res) => {
    db.get(`SELECT * FROM profiles WHERE user_id = ?`, [req.user.id], (err, profile) => {
        if (err) return res.status(500).json({ error: 'Server error' });
        res.json(profile || {});
    });
});

app.post('/api/profile', authenticateToken, (req, res) => {
    const { farm_type, location, animal_count } = req.body;
    db.run(`INSERT OR REPLACE INTO profiles (user_id, farm_type, location, animal_count) VALUES (?, ?, ?, ?)`,
        [req.user.id, farm_type, location, animal_count],
        (err) => {
            if (err) return res.status(500).json({ error: 'Server error' });
            res.json({ message: 'Profile updated' });
        }
    );
});

// 4. Assessment: Submit and Calculate Risk
app.post('/api/assessment', authenticateToken, (req, res) => {
    const { responses } = req.body;
    // Simple logic: responses is an array of 0/1 (0=No, 1=Yes to biosecurity practices)
    const score = Object.values(responses).reduce((a, b) => a + (b === 'yes' ? 10 : 0), 0);

    let risk_level = 'High';
    if (score > 70) risk_level = 'Low';
    else if (score > 40) risk_level = 'Medium';

    const date = new Date().toLocaleDateString();

    db.run(`INSERT INTO assessments (user_id, score, risk_level, date, responses) VALUES (?, ?, ?, ?, ?)`,
        [req.user.id, score, risk_level, date, JSON.stringify(responses)],
        function (err) {
            if (err) return res.status(500).json({ error: 'Server error' });
            res.json({ score, risk_level, date, id: this.lastID });
        }
    );
});

app.get('/api/assessment/history', authenticateToken, (req, res) => {
    db.all(`SELECT * FROM assessments WHERE user_id = ? ORDER BY id DESC LIMIT 5`, [req.user.id], (err, rows) => {
        if (err) return res.status(500).json({ error: 'Server error' });
        res.json(rows);
    });
});

// 5. Alerts: Get Sample Data
app.get('/api/alerts', authenticateToken, (req, res) => {
    db.all(`SELECT * FROM alerts ORDER BY id DESC`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: 'Server error' });
        res.json(rows);
    });
});

// 6. Compliance: Get/Update
app.get('/api/compliance', authenticateToken, (req, res) => {
    db.all(`SELECT * FROM compliance WHERE user_id = ?`, [req.user.id], (err, rows) => {
        if (err) return res.status(500).json({ error: 'Server error' });
        res.json(rows);
    });
});

app.post('/api/compliance', authenticateToken, (req, res) => {
    const { item_id, status } = req.body;
    const last_updated = new Date().toISOString();
    db.run(`INSERT OR REPLACE INTO compliance (user_id, item_id, status, last_updated) 
            VALUES (?, 
                    (SELECT item_id FROM compliance WHERE user_id = ? AND item_id = ?), 
                    ?, ?)`,
        [req.user.id, req.user.id, item_id, status, last_updated],
        (err) => {
            // Simplified for demo: if not exists, insert new
            db.run(`INSERT OR REPLACE INTO compliance (user_id, item_id, status, last_updated) VALUES (?, ?, ?, ?)`,
                [req.user.id, item_id, status, last_updated],
                (err) => {
                    if (err) return res.status(500).json({ error: 'Server error' });
                    res.json({ message: 'Compliance updated' });
                });
        }
    );
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

module.exports = app;
