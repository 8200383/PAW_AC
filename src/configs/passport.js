const passport = require('passport')
const { Strategy: LocalStrategy } = require('passport-local')
const { Account } = require('../schemas')
const { Strategy: JWTStrategy } = require('passport-jwt')
const ExtractJWT = require('passport-jwt').ExtractJwt

// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(Account.authenticate()))

// use static serialize and deserialize of model for passport session support
passport.serializeUser(Account.serializeUser())
passport.deserializeUser(Account.deserializeUser())

passport.use(new JWTStrategy(
    {
        secretOrKey: 'TOP_SECRET',
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    },
    async (token, done) => {
        try {
            const account = await Account.findOne({ _id: token._id })

            return done(null, account)
        } catch (error) {
            done(error, false)
        }
    },
))

module.exports = framework => {
    framework.use(passport.initialize())
    framework.use(passport.session())
}