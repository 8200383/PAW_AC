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
        console.info(token)

        try {
            const account = await Account.findOne({ email: token.iss })

            return done(null, account)
        } catch (error) {
            done(error, false)
        }
    },
))

module.exports = framework => {
    framework.use(passport.initialize())
}