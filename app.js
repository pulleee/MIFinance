const express = require("express");
const dotenv = require("dotenv");
const path = require('path');
var session = require("express-session");

/* Reading global variables from config file */
dotenv.config();
const PORT = process.env.PORT;

//setup routes
const indexRouter = require('./routes/index');
const registerRouter = require('./routes/register');
const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');
const buyRouter = require('./routes/buy');
const sellRouter = require('./routes/sell');
const quoteRouter = require('./routes/quote');
const historyRouter = require('./routes/history');
const profileRouter = require('./routes/profile');

//setup app
var app = express();
//set parser for post requests
app.use(express.urlencoded({ extended: false }));

// setup session
app.use(session({
    secret: "This is a secret!",
    resave: true,
    saveUninitialized: true,
    cookie: {maxAge: 3600000}
}));

//turn on serving static files (required for delivering css to client)
app.use('/css', express.static(path.join(__dirname, "public/stylesheets")));

//configure template engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

//define routes
app.use('/', indexRouter);
app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/buy', buyRouter);
app.use('/sell', sellRouter);
app.use('/quote', quoteRouter);
app.use('/history', historyRouter);
app.use('/profile', profileRouter)

app.listen(PORT, function() {
    console.log(`MI Finance running and listening on port ${PORT}`);
});
