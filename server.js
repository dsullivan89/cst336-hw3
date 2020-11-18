// this is the server, main.js is part of the client.

require('dotenv').config();

const express = require('express');
const app = express();



const path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var BnetStrategy = require('passport-bnet').Strategy;
const server = require('http').createServer(app);
const port = process.env.PORT || 3000;

var BNET_ID = process.env.BNET_ID;
var BNET_SECRET = process.env.BNET_SECRET;


app.set('view engine', 'ejs');

// app.use(express.static(path.join(__dirname, '/public')));
app.use('/public', express.static('public'));
//app.use( express.static( "public" ) );
app.set('views', path.join(__dirname, '/views'));

app.use(passport.initialize());
app.use(passport.session());

app.use(cookieParser());
app.use(session({ secret: 'blizzard',
                  saveUninitialized: true,
                  resave: true }));

server.listen(port, () => {
  console.log('Server listening at port %d', port);
});

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
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

app.get(['/', '/:code', '/index.html'], function(req, res) {
  if(req.isAuthenticated()) {
    var userid = req.user.id;
    var userbattletag = req.user.battletag;
    
    res.render('index', { code: req.params.name, id: userid, battletag: userbattletag });

    //res.sendFile(path.join(__dirname + '/public/index.html'), 
    //  { id: req.user.id, battletag: req.user.battletag } );
    // res.send(data);
    //res.writeHead(200, {'Content-Type': 'text/json'});
    //res.write(data);
    //res.end();
  }
  else
  {
    res.render('index', { code: "", id: "N/A", battletag: "N/A" });
  }

  

  //res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.get('/auth/bnet',
    passport.authenticate('bnet'));

app.get('/auth/bnet/callback',
    passport.authenticate('bnet', { failureRedirect: '/' }),
    function(req, res){
        res.redirect('/');
    });