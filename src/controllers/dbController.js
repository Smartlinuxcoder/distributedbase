const fs = require('fs');
const db = require('../config/db');
const { mergeDeep } = require('../utils/helpers');
const bcrypt = require('bcrypt');
exports.writeJson = async (req, res) => {
    try {
        const { sessiontoken, website, data, username, websitepassword, privileges } = req.body;
        if (websitepassword !== undefined && privileges !== undefined) {
            const result = await db.query("SELECT * FROM sites WHERE site = $1", [website]);
            const row = result.rows[0];
            if (!row) {
                return res.status(400).send("Invalid site or password");
            }
            const isValidPassword = await bcrypt.compare(websitepassword, row.password);
            if (!isValidPassword) {
                return res.status(400).send("Invalid site or password");
            }
            if (privileges !== "rw" && privileges !== "ro" && privileges !== "root") {
                return res.status(400).send("Invalid privileges");
            } else {
                const filePath = `./data/usercontent/${username}.json`;
                try {
                    const existingData = fs.readFileSync(filePath);
                    jsonData = JSON.parse(existingData);
                } catch (err) {
                    console.error("Error reading JSON file:", err);
                }
                jsonData[website][privileges] = data;
                fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).send("Error writing to JSON file");
                    }
                    return res.status(200).send(`Data written to ${username}.json under ${website} successfully`);
                });
            }

        } else {

            const sessionpath = `./data/sessions/${sessiontoken}.txt`;
            const sessionfile = fs.readFileSync(sessionpath, 'utf8');
            const parts = sessionfile.split('--');
            const usernamefromsession = parts[2];
            const filePath = `./data/usercontent/${usernamefromsession}.json`;

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

            jsonData[website]["rw"] = data;
            fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send("Error writing to JSON file");
                }
                res.status(200).send(`Data written to ${usernamefromsession}.json under ${website} successfully`);
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Error writing to JSON file");
    }
};

exports.updateJson = async (req, res) => {
    try {
        const { sessiontoken, website, data, username, websitepassword, privileges } = req.body;
        if (websitepassword !== undefined && privileges !== undefined) {
            const result = await db.query("SELECT * FROM sites WHERE site = $1", [website]);
            const row = result.rows[0];

            if (!row) {
                return res.status(400).send("Invalid site or password");
            }
            const isValidPassword = await bcrypt.compare(websitepassword, row.password);
            if (!isValidPassword) {
                return res.status(400).send("Invalid site or password");
            }
            if (privileges !== "rw" && privileges !== "ro" && privileges !== "root") {
                return res.status(400).send("Invalid privileges");
            } else {
                const filePath = `./data/usercontent/${username}.json`;
                try {
                    const existingData = fs.readFileSync(filePath);
                    jsonData = JSON.parse(existingData);
                } catch (err) {
                    console.error("Error reading JSON file:", err);
                }
                jsonData[website][privileges] = mergeDeep(jsonData[website][privileges] || {}, data);
                fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).send("Error writing to JSON file");
                    }
                    res.status(200).send(`Data updated in ${username}.json under ${website} successfully`);
                });
            }
        } else {
            const sessionpath = `./data/sessions/${sessiontoken}.txt`;
            const sessionfile = fs.readFileSync(sessionpath, 'utf8');
            const parts = sessionfile.split('--');
            const usernamefromsession = parts[2];
            const filePath = `./data/usercontent/${usernamefromsession}.json`;

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

            jsonData[website]["rw"] = mergeDeep(jsonData[website]["rw"] || {}, data);

            fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send("Error writing to JSON file");
                }
                res.status(200).send(`Data updated in ${usernamefromsession}.json under ${website} successfully`);
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Error updating JSON file");
    }
};

exports.readJson = async (req, res) => {
    const { sessiontoken, website, username, websitepassword, privileges } = req.body;
    if (websitepassword !== undefined) {
        const result = await db.query("SELECT * FROM sites WHERE site = $1", [website]);
        const row = result.rows[0];

        if (!row) {
            return res.status(400).send("Invalid site or password");
        }
        const isValidPassword = await bcrypt.compare(websitepassword, row.password);
        if (!isValidPassword) {
            return res.status(400).send("Invalid site or password");
        }

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


    } else {
        try {
            const sessionpath = `./data/sessions/${sessiontoken}.txt`;
            const sessionfile = fs.readFileSync(sessionpath, 'utf8');
            const parts = sessionfile.split('--');
            const usernamefromsession = parts[2];
            const filePath = `./data/usercontent/${usernamefromsession}.json`;

            fs.readFile(filePath, (err, data) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send("Error reading JSON file");
                }
                try {
                    const jsonData = JSON.parse(data);
                    const websiteData = {
                        ...jsonData[website]["rw"],
                        ...jsonData[website]["ro"]
                    };

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
    }
};



