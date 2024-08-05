const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const logger = require('./src/logging');

const app = express();


app.use(logger);

app.use(bodyParser.json());
app.use(cors());
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        console.error('Bad JSON:', err.message);
        return res.status(400).json({ error: 'Invalid JSON payload' });
    }
    next();
});
// Import routes
const dbRoutes = require('./src/routes/dbRoutes');
const siteRoutes = require('./src/routes/siteRoutes');
const userRoutes = require('./src/routes/userRoutes');
app.use(express.static('public'));
// Use routes
app.use('/api/db', dbRoutes);
app.use('/api/site', siteRoutes);
app.use('/api/user', userRoutes);

const PORT = process.env.PORT || 8090;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));