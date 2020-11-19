const passport = require('passport');
const BnetStrategy = require('passport-bnet').Strategy;

const passportOptions = {
    clientID: process.env.BNET_ID,
    clientSecret: process.env.BNET_SECRET,
    callbackURL: "https://dasu20-hw3.herokuapp.com/auth/bnet/callback",
    scope: 'wow.profile'
};

const passportCallback = (accessToken, refreshToken, profile, done) => {
    process.nextTick(() => {
        return done(null, profile);
    });
};

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

passport.use(new BnetStrategy(passportOptions, passportCallback));

module.exports = passport;