const express = require('express');
const cors = require('cors');
const path = require('path');
const { Errors } = require('./functions');
const { HandleNullString } = require('./middlewares/index');
const app = express();
const config = require('./config')();

// Initializing Middlewares
app.use(cors());
app.use(express.json());

// Middleware for adding delaying
// app.use(function(req,res,next){setTimeout(next,3000)});

app.use('/public', express.static( path.join( __dirname, './public') ));
app.use('/', express.static( path.join( __dirname, '../app') ));
// app.use('/', express.static( path.join( __dirname, './webapp') ));
app.use(HandleNullString);
// console.log(__dirname);

// IMPORTING DATABASE
require('./database/models');

// Importing Routes
const routes = require('./routes');

// REGISTERING ROUTES
app.use('/api', routes);

// HANDLING WILD CARD ROUTE
app.get('*', (req, res) => {

    if(!req.xhr && req.headers['postman-token'] == undefined) return res.sendFile( path.join( __dirname, '../app/index.html') );
    new Errors(res, { status: 404, error: 'Not Found', message: ''});

});

// STARTING SERVER
app.listen(config.APP.PORT, ()=> {
    console.log(`[SERVER] Enviorment set to: '${config.environment}'`);
    console.log(`[SERVER] App is listning on Port: ${config.APP.PORT}`)
});