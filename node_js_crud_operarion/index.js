var createError = require('http-errors');
var express = require('express');
var path = require('path');
var flash = require('express-flash');
var session = require('express-session');
var mysql = require('mysql');
var connection  = require('./lib/db');
var usersRouter = require('./routes/users');

var app = express();

// ====================
// View Engine Setup
// ====================
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// ====================
// Middleware
// ====================
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ 
    cookie: { maxAge: 60000 },
    store: new session.MemoryStore(),
    saveUninitialized: true,
    resave: true,
    secret: 'secret'
}));

app.use(flash());

// ====================
// Correct Homepage Redirect
// ====================
app.get('/', (req, res) => {
    res.redirect('/users');   // load the CRUD homepage
});

// ====================
// Routes
// ====================
app.use('/users', usersRouter);

// ====================
// Catch 404
// ====================
app.use(function(req, res, next) {
  next(createError(404));
});

// ====================
// Error Handler
// ====================
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

// ====================
// Start Server
// ====================
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    console.log(
