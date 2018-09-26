//module constants
const flash = require('express-flash');
const session = require('express-session');
const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const pg = require("pg");
const RoutesFunctions = require('./RoutesFunctions');
const WeekDays = require('./Week_days');
const Pool = pg.Pool;
let app = express();

// should we use a SSL connection
let useSSL = false;
let local = process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local) {
    useSSL = true;
}
// connection to database
let connectionString = process.env.DATABASE_URL || 'postgres://busisile:pg123@localhost/waiter_database';
//pool constructor
const pool = new Pool({
    connectionString,
    ssl: useSSL
});
// initialise session middleware - flash-express depends on it
app.use(session({
    secret: "This my secret",
    resave: false,
    saveUninitialized: true
}));

// initialise the flash middleware
app.use(flash());
//default settings
app.use(express.static('public'));
app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    helpers: 'helpers'
}));
app.set('view engine', 'handlebars');
//instances
let myWeekDays = WeekDays(pool);
let routes = RoutesFunctions(myWeekDays);

//using body parser
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

//routes
app.get('/waiter/:name', routes.index);
app.post('/waiter/:name', routes.postData);
app.get('/days', routes.getBookings);
app.post('/reset', routes.clearDays)

//add the PORT
let PORT = process.env.PORT || 3081;
app.listen(PORT, function () {
    console.log("started on: ", this.address().port);
});
