const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const ensureLoggedIn = require('./config/ensureLoggedIn')

require('dotenv').config()
require('./config/database')

const app = express();

app.use(logger('dev'));
app.use(express.json());

app.use(favicon(path.join(__dirname, 'build', 'favicon.ico')))
app.use(express.static(path.join(__dirname, 'build')))

//Check token middleware
app.use(require('./config/checkToken'))

// Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/activities', ensureLoggedIn, require('./routes/api/activities'));
app.use('/api/activityPlans', ensureLoggedIn, require('./routes/api/activityPlans'));

// Catch All Route
app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

const port = process.env.PORT || 3001

app.listen(port, function() {
    console.log(`Express app running on port ${port}`)
});