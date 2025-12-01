const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const db = require('./db');

const app = express();
const PORT = 5000;
const SECRET_KEY = "your_super_secret_key_change_this";

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' })); // Increased limit for base64 images

// --- Middleware ---
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

// --- Auth Routes ---

// Register
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: "Email and password required" });

        // Check if exists
        const [existing] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        if (existing.length > 0) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const uid = uuidv4();
        const displayName = email.split('@')[0];

        await db.query(
            "INSERT INTO users (uid, email, password, display_name) VALUES (?, ?, ?, ?)",
            [uid, email, hashedPassword, displayName]
        );

        res.status(201).json({ message: "User created" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        
        if (users.length === 0) return res.status(400).json({ message: "User not found" });
        
        const user = users[0];
        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) return res.status(400).json({ message: "Invalid password" });

        const token = jwt.sign({ id: user.id, uid: user.uid, email: user.email }, SECRET_KEY, { expiresIn: '24h' });

        // Return user data (excluding password)
        const userData = {
            uid: user.uid,
            email: user.email,
            displayName: user.display_name,
            photoURL: user.photo_url,
            bio: user.bio,
            birthdate: user.birthdate
        };

        res.json({ token, user: userData });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update Profile
app.put('/api/auth/profile', authenticateToken, async (req, res) => {
    try {
        const { displayName, photoURL, bio, birthdate } = req.body;
        
        await db.query(
            "UPDATE users SET display_name = ?, photo_url = ?, bio = ?, birthdate = ? WHERE id = ?",
            [displayName, photoURL, bio, birthdate, req.user.id]
        );

        // Fetch updated user to return
        const [users] = await db.query("SELECT * FROM users WHERE id = ?", [req.user.id]);
        const user = users[0];
        
        const userData = {
            uid: user.uid,
            email: user.email,
            displayName: user.display_name,
            photoURL: user.photo_url,
            bio: user.bio,
            birthdate: user.birthdate
        };

        res.json({ user: userData });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Log Routes ---

// Get Logs
app.get('/api/logs', authenticateToken, async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM daily_logs WHERE user_id = ? ORDER BY date DESC", [req.user.id]);
        
        // Transform DB snake_case to frontend camelCase
        const logs = rows.map(row => ({
            id: row.id,
            date: row.date,
            sleepMetrics: {
                durationHours: row.duration_hours,
                qualityScore: row.quality_score
            },
            habits: {
                caffeineLate: Boolean(row.caffeine_late),
                screenTimeLate: Boolean(row.screen_time_late),
                alcoholLate: Boolean(row.alcohol_late),
                stressLevel: row.stress_level
            },
            energyRating: row.energy_rating,
            userNotes: row.user_notes
        }));

        res.json(logs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add Log
app.post('/api/logs', authenticateToken, async (req, res) => {
    try {
        const { date, sleepMetrics, habits, energyRating, userNotes } = req.body;
        
        await db.query(
            `INSERT INTO daily_logs 
            (user_id, date, duration_hours, quality_score, caffeine_late, screen_time_late, alcohol_late, stress_level, energy_rating, user_notes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                req.user.id, 
                date, 
                sleepMetrics.durationHours, 
                sleepMetrics.qualityScore,
                habits.caffeineLate,
                habits.screenTimeLate,
                habits.alcoholLate,
                habits.stressLevel,
                energyRating,
                userNotes
            ]
        );

        res.status(201).json({ message: "Log saved" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete Log
app.delete('/api/logs/:date', authenticateToken, async (req, res) => {
    try {
        // We delete by date for simplicity based on current frontend logic.
        const dateStr = req.params.date; 
        
        await db.query("DELETE FROM daily_logs WHERE user_id = ? AND date = ?", [req.user.id, dateStr]);
        res.json({ message: "Log deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});