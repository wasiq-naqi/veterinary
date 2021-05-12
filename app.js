const express = require('express');
const cors = require('cors');
const path = require('path');
const {  Errors } = require('./functions');
const { HandleNullString } = require('./middlewares/index');
const app = express();

const dotenv = require('dotenv');
dotenv.config({ path: __dirname + '/.env'});

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

const routes = require('./routes');

// IMPORTING DATABASE
require('./models/index');

// REGISTERING ROUTES
app.use('/api', routes);

// HANDLING WILD CARD ROUTE
app.get('*', (req, res) => {

    if(!req.xhr && req.headers['postman-token'] == undefined) return res.sendFile( path.join( __dirname, '../app/index.html') );
    new Errors(res, { status: 404, error: 'Not Found', message: ''});

});

// STARTING SERVER
app.listen(process.env.APP_PORT, ()=> {
    console.log(`App is listning on Port: ${process.env.APP_PORT}`)
});