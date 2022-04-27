const passport = require('passport')
const { Account } = require('../schemas')
const { Strategy: JWTStrategy } = require('passport-jwt')
const ExtractJWT = require('passport-jwt').ExtractJwt
const jwtSecret = require('./security.json')

passport.use(new JWTStrategy(
    {
        secretOrKey: jwtSecret.secret,
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    },
    async (token, done) => {
        try {
            const account = await Account.findOne({ email: token.email })

            return done(null, account)
        } catch (error) {
            return done(error, false)
        }
    },
))

module.exports = framework => {
    framework.use(passport.initialize({}))
}