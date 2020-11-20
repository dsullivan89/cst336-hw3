// this is the server, main.js is part of the client.

require('dotenv').config();

const Promise = require('bluebird');
const path = require('path');

const express = require('express');
var cookieParser = require('cookie-parser');

var session = require('express-session');

let RedisStore = require('connect-redis')(session);
const redis = require('redis');

var passport = require('./oauth/passport');

// const rp = require('request-promise');
// var async = require("async");

const OauthClient = require('./oauth/OAuthClient');
const RealmService = require('./services/RealmService');

const createLogger = require('pino');
const logger = createLogger();

//let redisClient = redis.createClient()

let redisClient;
if (process.env.REDIS_URL) {
  redisClient = redis.createClient(process.env.REDIS_URL);
} else {
  redisClient = redis.createClient({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT
  });
}

const redisSessionStore = new RedisStore({
  client: redisClient
});

const oauthClient = new OauthClient();
const realmService = new RealmService(oauthClient);

const app = express();

app.set('view engine', 'ejs');

app.use('/public', express.static('public'));
app.set('views', path.join(__dirname, '/views'));

app.use((req, res, next) => {
  if (req.isAuthenticated()) {
      res.locals.currentUser = req.user;
  }
  next();
});

app.use(cookieParser());
app.use(session({ name: 'blizzard-api-example-session',
                  secret: 'blizzard-api-example-session-secret',
                  saveUninitialized: true,
                  resave: true,
                  store: redisSessionStore }));

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  if (req.isAuthenticated()) {
      res.locals.currentUser = req.user;
  }
  next();
});

//var BnetStrategy = require('passport-bnet').Strategy;
// const server = require('http').createServer(app);
// const port = process.env.PORT || 3000;

var BNET_ID = process.env.BNET_ID;
var BNET_SECRET = process.env.BNET_SECRET;


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
    const data = await realmService.getRealms(
      "dynamic-classic-us", 
      "en_US", 
      "UP", 
      "America/New_York", 
      "id", 
      "1");
    console.log(JSON.stringify(data));
    res.render('realms', {
      realmData: data
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
      const characters = await realmService.getUsersCharactersList(oauthClient.getToken());
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

module.exports = async () => {
  await oauthClient.getToken();
  return Promise.resolve(app);
};