const fs = require('fs');
const db = require('../config/db');
const { mergeDeep } = require('../utils/helpers');
const bcrypt = require('bcrypt');

exports.writeJson = async (req, res) => {
    try {
        const { sessiontoken, website, data, username, websitepassword, privileges } = req.body;

        if (websitepassword !== undefined && privileges !== undefined) {
            const siteResult = await db.query("SELECT * FROM sites WHERE site = $1", [website]);
            const siteRow = siteResult.rows[0];

            if (!siteRow) {
                return res.status(400).send("Invalid site or password");
            }

            const isValidPassword = await bcrypt.compare(websitepassword, siteRow.password);
            if (!isValidPassword) {
                return res.status(400).send("Invalid site or password");
            }

            if (!['rw', 'ro', 'root'].includes(privileges)) {
                return res.status(400).send("Invalid privileges");
            }

            const userResult = await db.query("SELECT usercontent FROM users WHERE username = $1", [username]);
            let jsonData = userResult.rows[0].usercontent || {};

            jsonData[website] = jsonData[website] || {};
            jsonData[website][privileges] = data;

            await db.query("UPDATE users SET usercontent = $1 WHERE username = $2", [jsonData, username]);
            return res.status(200).send(`Data written to ${username} under ${website} successfully`);
        } else {
            const sessionResult = await db.query("SELECT * FROM sessions WHERE token = $1", [sessiontoken]);
            const sessionRow = sessionResult.rows[0];
            console.log(sessionRow)
            console.log(sessionRow.site)
            if (!sessionRow || website !== sessionRow.site) {
                return res.status(403).send("Access denied. Invalid token.");
            }

            const userResult = await db.query("SELECT usercontent FROM users WHERE username = $1", [sessionRow.username]);
            let jsonData = userResult.rows[0].usercontent || {};

            jsonData[website] = jsonData[website] || {};
            jsonData[website]["rw"] = data;

            await db.query("UPDATE users SET usercontent = $1 WHERE username = $2", [jsonData, sessionRow.username]);
            res.status(200).send(`Data written to ${sessionRow.username} under ${website} successfully`);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Error writing to JSON data");
    }
};


exports.updateJson = async (req, res) => {
    try {
        const { sessiontoken, website, data, username, websitepassword, privileges } = req.body;

        if (websitepassword !== undefined && privileges !== undefined) {
            const siteResult = await db.query("SELECT * FROM sites WHERE site = $1", [website]);
            const siteRow = siteResult.rows[0];

            if (!siteRow) {
                return res.status(400).send("Invalid site or password");
            }

            const isValidPassword = await bcrypt.compare(websitepassword, siteRow.password);
            if (!isValidPassword) {
                return res.status(400).send("Invalid site or password");
            }

            if (!['rw', 'ro', 'root'].includes(privileges)) {
                return res.status(400).send("Invalid privileges");
            }

            const userResult = await db.query("SELECT usercontent FROM users WHERE username = $1", [username]);
            let jsonData = userResult.rows[0].usercontent || {};

            jsonData[website] = jsonData[website] || {};
            jsonData[website][privileges] = mergeDeep(jsonData[website][privileges] || {}, data);

            await db.query("UPDATE users SET usercontent = $1 WHERE username = $2", [jsonData, username]);
            res.status(200).send(`Data updated in ${username} under ${website} successfully`);
        } else {
            const sessionResult = await db.query("SELECT * FROM sessions WHERE token = $1", [sessiontoken]);
            const sessionRow = sessionResult.rows[0];
            if (!sessionRow || website !== sessionRow.site) {
                return res.status(403).send("Access denied. Invalid token.");
            }

            const userResult = await db.query("SELECT usercontent FROM users WHERE username = $1", [sessionRow.username]);
            let jsonData = userResult.rows[0].usercontent || {};

            jsonData[website] = jsonData[website] || {};
            jsonData[website]["rw"] = mergeDeep(jsonData[website]["rw"] || {}, data);

            await db.query("UPDATE users SET usercontent = $1 WHERE username = $2", [jsonData, sessionRow.username]);
            res.status(200).send(`Data updated in ${sessionRow.username} under ${website} successfully`);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Error updating JSON data");
    }
};


exports.readJson = async (req, res) => {
    try {
        const { sessiontoken, website, username, websitepassword, privileges } = req.body;

        if (websitepassword !== undefined) {
            const siteResult = await db.query("SELECT * FROM sites WHERE site = $1", [website]);
            const siteRow = siteResult.rows[0];

            if (!siteRow) {
                return res.status(400).send("Invalid site or password");
            }

            const isValidPassword = await bcrypt.compare(websitepassword, siteRow.password);
            if (!isValidPassword) {
                return res.status(400).send("Invalid site or password");
            }

            const userResult = await db.query("SELECT usercontent FROM users WHERE username = $1", [username]);
            const jsonData = userResult.rows[0].usercontent || {};
            const websiteData = jsonData[website];

            if (!websiteData) {
                return res.status(404).send("Website data not found");
            }

            res.status(200).json(websiteData);
        } else {
            const sessionResult = await db.query("SELECT * FROM sessions WHERE token = $1", [sessiontoken]);
            const sessionRow = sessionResult.rows[0];

            if (!sessionRow || website !== sessionRow.site) {
                return res.status(403).send("Access denied. Invalid token.");
            }

            const userResult = await db.query("SELECT usercontent FROM users WHERE username = $1", [sessionRow.username]);
            const jsonData = userResult.rows[0].usercontent || {};
            const websiteData = {
                ...jsonData[website]?.["rw"],
                ...jsonData[website]?.["ro"]
            };

            if (!websiteData) {
                return res.status(404).send("Website data not found");
            }

            res.status(200).json(websiteData);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Error reading JSON data");
    }
};
