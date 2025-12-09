var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');

// ====================
// Display Users Page
// ====================
router.get('/', function(req, res, next) {      
    dbConn.query('SELECT * FROM users ORDER BY id desc', function(err, rows) {
        if (err) {
            req.flash('error', err);
            res.render('users/index', { data: '' });
        } else {
            res.render('users/index', { data: rows });
        }
    });
});

// ====================
// Display Add User Page
// ====================
router.get('/add', function(req, res) {    
    res.render('users/add', {
        name: '',
        email: '',
        position: ''
    });
});

// ====================
// Add New User
// ====================
router.post('/add', function(req, res) {    

    let name = req.body.name;
    let email = req.body.email;
    let position = req.body.position;
    let errors = false;

    if (name.length === 0 || email.length === 0 || position.length === 0) {
        errors = true;
        req.flash('error', "Please enter name, email, and position");
        res.render('users/add', { name, email, position });
    }

    if (!errors) {
        var form_data = { name, email, position };
        
        dbConn.query('INSERT INTO users SET ?', form_data, function(err) {
            if (err) {
                req.flash('error', err);
                res.render('users/add', form_data);
            } else {                
                req.flash('success', 'User successfully added');
                res.redirect('/users');
            }
        });
    }
});

// ====================
// Display Edit User Page
// ====================
router.get('/edit/:id', function(req, res) {

    let id = req.params.id;
   
    dbConn.query('SELECT * FROM users WHERE id = ?', [id], function(err, rows) {
        if (err) throw err;
         
        if (rows.length <= 0) {
            req.flash('error', 'User not found with id = ' + id);
            res.redirect('/users/edit');
        } else {
            res.render('users/edit', {
                id: rows[0].id,
                name: rows[0].name,
                email: rows[0].email,
                position: rows[0].position
            });
        }
    });
});

// ====================
// Update User
// ====================
router.post('/update/:id', function(req, res) {

    let id = req.params.id;
    let { name, email, position } = req.body;
    let errors = false;

    if (name.length === 0 || email.length === 0 || position.length === 0) {
        errors = true;
        req.flash('error', "Please enter all fields");
        res.render('users/edit', { id, name, email, position });
    }

    if (!errors) {
        var form_data = { name, email, position };

        dbConn.query('UPDATE users SET ? WHERE id = ?', [form_data, id], function(err) {
            if (err) {
                req.flash('error', err);
                res.render('users/edit', { id, name, email, position });
            } else {
                req.flash('success', 'User successfully updated');
                res.redirect('/users');
            }
        });
    }
});

// ====================
// Delete User
// ====================
router.get('/delete/:id', function(req, res) {

    let id = req.params.id;
     
    dbConn.query('DELETE FROM users WHERE id = ?', [id], function(err) {
        if (err) {
            req.flash('error', err);
            res.redirect('/users/');
        } else {
            req.flash('success', 'User deleted! ID = ' + id);
            res.redirect('/users');
        }
    });
});

module.exports = router;
