// this is the server, main.js is part of the client.

require('dotenv').config();

const express = require('express');
const app = express();

const rp = require('request-promise');
var async = require("async");

const path = require('path');
var cookieParser = require('cookie-parser');

const redis = require('redis')
var session = require('express-session');

var passport = require('passport');

let RedisStore = require('connect-redis')(session)
//let redisClient = redis.createClient()

const createLogger = require('pino');

const logger = createLogger();

let redisClient;
if (process.env.REDIS_URL) {
  redisClient = redis.createClient(process.env.REDIS_URL);
} else {
  redisClient = redis.createClient({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT
  });
}

const OauthClient = require('./oauth/OAuthClient');
const RealmService = require('./services/RealmService');

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


const redisSessionStore = new RedisStore({
  client: redisClient
});

app.use(cookieParser());
app.use(session({ name: 'blizzard-api-example-session',
                  secret: 'blizzard-api-example-session-secret',
                  saveUninitialized: true,
                  resave: true,
                  store: redisSessionStore }));

app.use(passport.initialize());
app.use(passport.session());                  

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

const oauthClient = new OauthClient();
const realmService = new RealmService(oauthClient);

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
  if(req.isAuthenticated()) {
    var userid = req.user.id;
    var userbattletag = req.user.battletag;
    
    res.render('index', { id: userid, battletag: userbattletag });

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

app.get('/login', (req, res) => {
  res.redirect('/login/oauth/battlenet');
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

app.get('/auth/bnet',
    passport.authenticate('bnet'));

app.get('/auth/bnet/callback',
    passport.authenticate('bnet', { failureRedirect: '/' }),
    function(req, res){
        res.redirect('/');
    });

app.get('/realmlist', async (req, res, next) => {
  
  try {
    const characters = await realmService.getRealms("dynamic-classic-us", "en_US", "id", "1");
    res.render('realms', {
        characters
    });
  } catch (e) {
    next(e);
    }
    }, (err, req, res, next) => {
    logger.error(err);
    res.render("error-realms");

});

app.get('/characters', async (req, res, next) => {
  try {
      const characters = await realmService.getUsersCharactersList(req.user.token);
      //getUsersCharactersList(req.user.token);
      res.render('characters', {
          characters
      });
  } catch (e) {
      next(e);
  }
}, (err, req, res, next) => {
  logger.error(err);
  res.render("error-characters");
});