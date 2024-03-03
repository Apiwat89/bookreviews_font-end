const express = require('express');
const axios = require('axios');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const multer  = require('multer');

const app = express();
app.set("views", path.join(__dirname, "/public/views"));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(__dirname + '/public'));
app.use(cookieParser());

const base_url = "http://localhost:3000";

app.get("/", async (req, res) => {
    try {
        return res.render("home", {
            user: req.cookies.username,
            role: req.cookies.role
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error /')
    }
}); 

app.get("/signup", async (req, res) => {
    try {
        return res.render("signup", {check: false});
    } catch (err) {
        console.error(err);
        res.status(500).send('Error signup')
    }
}); 

app.post("/signup", async (req, res) => {
    try {
        const data = {
            username: req.body.username,
            password: req.body.password,
            email: req.body.email
        }
        await axios.post(base_url + "/user", data);
        return res.render("signup", {check: true});
    } catch (err) {
        console.error(err);
        res.status(500).send('Error signup [post]')
    }
}); 

app.get("/login", async (req, res) => {
    try {
        return res.render("login", {check: false});
    } catch (err) {
        console.error(err);
        res.status(500).send('Error login')
    }
}); 

app.post("/login", async (req, res) => {
    try {
        const response = await axios.get(base_url + "/user");
        const users = response.data;
        for (let user of users) {
            if (user.username === req.body.username) {
                if (user.password === req.body.password) {
                    res.cookie('username', user.username, { maxAge: 900000, httpOnly: true });
                    if (user.role === 'user') res.cookie('role', 'user', { maxAge: 900000, httpOnly: true });
                    if (user.role === 'admin') res.cookie('role', 'admin', { maxAge: 900000, httpOnly: true });
                    return res.redirect("/");
                }
            }
        }
        return res.render("login", {check: true});
    } catch (err) {
        console.error(err);
        res.status(500).send('Error login [post]')
    }
}); 

app.get("/logout", async (req, res) => {
    try {
        res.clearCookie('username');
        return res.redirect("/");
    } catch (err) {
        console.error(err);
        res.status(500).send('Error login [post]')
    }
}); 

app.listen(5500, () => console.log('Server stated on http://localhost:5500'));