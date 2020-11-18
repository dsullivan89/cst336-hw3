// this is the server, main.js is part of the client.

require('dotenv').config();

const express = require('express');
const app = express();
const path = require('path');
var passport = require('passport');
var BnetStrategy = require('passport-bnet').Strategy;
const server = require('http').createServer(app);
const port = process.env.PORT || 3000;

var BNET_ID = process.env.BNET_ID
var BNET_SECRET = process.env.BNET_SECRET

app.use(express.static(path.join(__dirname, 'public')));

server.listen(port, () => {
  console.log('Server listening at port %d', port);
});

// Use the BnetStrategy within Passport.
passport.use(
  new BnetStrategy(
    { clientID: BNET_ID,
      clientSecret: BNET_SECRET,
      scope: "wow.profile sc2.profile",
      callbackURL: "https://dasu20-hw3.herokuapp.com/auth/bnet/callback" },
    function(accessToken, refreshToken, profile, done) {
      process.nextTick(function () {
        return done(null, profile);
      });
    })
);

app.get('/initialData', function(req, res) {
  var data = {
    id: req.user.id,
    battletag: req.user.battletag
  }

  res.writeHead(200, {'Content-Type': 'text/json'});
  res.write(data);
  res.end();
});

app.get('/', function(req, res) {
  
  res.sendFile(path.join(__dirname + './public/index.html'));
});

app.get('/auth/bnet',
    passport.authenticate('bnet'));

app.get('/auth/bnet/callback',
    passport.authenticate('bnet', { failureRedirect: '/' }),
    function(req, res){
        res.redirect('/');
    });