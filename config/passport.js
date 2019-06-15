const passport = require('passport');
const User = require('../models/user');
const LocalStrategy = require('passport-local').Strategy;

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    req.checkBody('email', 'Invalid email').notEmpty().isEmail();
    req.checkBody('password', 'Invalid password').notEmpty().isLength({min:4});
    let errors = req.validationErrors();
    if(errors) {
        let messages = [];
        errors.forEach((error) => {
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    }

    const user = await User.findOne({'email': email});
    if(user) {
        return done(null, false, {message: 'Email is already in use.'});
    }

    let newUser = new User();
    newUser.email = email;
    newUser.password = await newUser.encryptPassword(password);
    const result = await newUser.save()
    return done(null, result);
}));

passport.use('local.signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    req.checkBody('email', 'Invalid email').notEmpty().isEmail();
    req.checkBody('password', 'Invalid password').notEmpty();
    const errors = req.validationErrors();
    if(errors) {
        let messages = [];
        errors.forEach((error) => {
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    }
    const user = await User.findOne({'email': email});
    if(!user) {
        return done(null, false, {message: 'No user found.'});
    }
    const valided = await user.validPassword(password);
    if(!valided) {
        return done(null, false, {message: 'Wrong password.'});
    }
    return done(null, user); 
}));