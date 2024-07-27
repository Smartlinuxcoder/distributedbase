const fs = require('fs');
const db = require('../config/db');
const { mergeDeep } = require('../utils/helpers');

exports.writeJson = (req, res) => {
    try {
        const { sessiontoken, website, data } = req.body;
        const sessionpath = `./data/sessions/${sessiontoken}.txt`;
        const sessionfile = fs.readFileSync(sessionpath, 'utf8');
        const parts = sessionfile.split('--');
        const username = parts[2];
        const filePath = `./data/usercontent/${username}.json`;

        let jsonData = {};
        try {
            const existingData = fs.readFileSync(filePath);
            jsonData = JSON.parse(existingData);
        } catch (err) {
            console.error("Error reading JSON file:", err);
        }

        if (website !== parts[0]) {
            return res.status(403).send("Access denied. Invalid token.");
        }

        jsonData[website] = data;
        fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Error writing to JSON file");
            }
            res.status(200).send(`Data written to ${username}.json under ${website} successfully`);
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error writing to JSON file");
    }
};

exports.updateJson = (req, res) => {
    try {
        const { sessiontoken, website, data } = req.body;
        const sessionpath = `./data/sessions/${sessiontoken}.txt`;
        const sessionfile = fs.readFileSync(sessionpath, 'utf8');
        const parts = sessionfile.split('--');
        const username = parts[2];
        const filePath = `./data/usercontent/${username}.json`;

        let jsonData = {};
        try {
            const existingData = fs.readFileSync(filePath);
            jsonData = JSON.parse(existingData);
        } catch (err) {
            if (err.code === 'ENOENT') {
                jsonData = {};
            } else {
                console.error("Error reading JSON file:", err);
                return res.status(500).send("Error reading JSON file");
            }
        }

        if (website !== parts[0]) {
            return res.status(403).send("Access denied. Invalid token.");
        }

        jsonData[website] = mergeDeep(jsonData[website] || {}, data);

        fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Error writing to JSON file");
            }
            res.status(200).send(`Data updated in ${username}.json under ${website} successfully`);
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error updating JSON file");
    }
};

exports.readJson = (req, res) => {
    try {
        const { sessiontoken, website } = req.body;
        const sessionpath = `./data/sessions/${sessiontoken}.txt`;
        const sessionfile = fs.readFileSync(sessionpath, 'utf8');
        const parts = sessionfile.split('--');
        const username = parts[2];
        const filePath = `./data/usercontent/${username}.json`;

        fs.readFile(filePath, (err, data) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Error reading JSON file");
            }
            try {
                const jsonData = JSON.parse(data);
                const websiteData = jsonData[website];
                if (!websiteData) {
                    return res.status(404).send("Website data not found");
                }
                res.status(200).json(websiteData);
            } catch (parseError) {
                console.error(parseError);
                res.status(500).send("Error parsing JSON data");
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error reading JSON file");
    }
};
