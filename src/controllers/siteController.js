const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const db = require('../config/db');
const { jwtSecret } = require('../../config');

exports.register = async (req, res) => {
    try {
        const { site, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        db.run("INSERT INTO sites (site, password) VALUES (?, ?)", [site, hashedPassword], function (err) {
            if (err) {
                console.error(err);
                return res.status(400).send("Site already exists");
            }
            res.status(201).send("Site registered successfully");
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error registering site");
    }
};

exports.login = async (req, res) => {
    try {
        const { site, password } = req.body;
        db.get("SELECT * FROM sites WHERE site = ?", [site], async (err, row) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Error logging in");
            }
            if (!row) {
                return res.status(400).send("Invalid site or password");
            }
            const isValidPassword = await bcrypt.compare(password, row.password);
            if (!isValidPassword) {
                return res.status(400).send("Invalid site or password");
            }
            const token = jwt.sign({ site: row.site }, jwtSecret);
            res.status(200).json({ token });
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error logging in");
    }
};

exports.secureAccess = async (req, res) => {
    try {
        const { site, password, sessiontoken } = req.body;
        db.get("SELECT * FROM sites WHERE site = ?", [site], async (err, row) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Error checking site");
            }
            if (!row) {
                return res.status(400).send("Invalid site or password");
            }
            const isValidPassword = await bcrypt.compare(password, row.password);
            if (!isValidPassword) {
                return res.status(400).send("Invalid site or password");
            }
            const filePath = `./data/sessions/${sessiontoken}.txt`;
            const data = fs.readFileSync(filePath, 'utf8');
            const parts = data.split('--');
            if (site !== parts[0]) {
                return res.status(403).send("Access denied. Invalid token.");
            }
            const username = parts[2];
            res.status(200).json({ username });
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error verifying access");
    }
};
