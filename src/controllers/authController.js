const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const crypto = require('crypto');
const db = require('../config/db');
const { jwtSecret } = require('../../config');

const generateSalt = (length) => crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
const generateHash = (data) => crypto.createHash('sha256').update(data).digest('hex');

exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        db.run("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashedPassword], function (err) {
            if (err) {
                console.error(err);
                return res.status(400).send("Username already exists");
            }
            res.status(201).send("User registered successfully");
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error registering user");
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password, site } = req.body;
        db.get("SELECT * FROM users WHERE username = ?", [username], async (err, row) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Error logging in");
            }
            if (!row) {
                return res.status(400).send("Invalid username or password");
            }
            const isValidPassword = await bcrypt.compare(password, row.password);
            if (!isValidPassword) {
                return res.status(400).send("Invalid username or password");
            }
            const token = jwt.sign({ username: row.username }, jwtSecret);
            const timestamp = Date.now();
            const salt = generateSalt(16);
            const session = `${site}--${token}--${username}--${timestamp}--${salt}`;
            const hash = generateHash(session);
            const filePath = `./data/sessions/${hash}.txt`;
            fs.writeFileSync(filePath, session);
            setTimeout(() => {
                fs.unlinkSync(filePath);
            }, 10 * 60 * 1000); // 10 minutes in milliseconds
            res.status(200).json({ hash });
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error logging in");
    }
};