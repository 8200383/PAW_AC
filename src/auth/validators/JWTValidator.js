const JWTStrategy = require('passport-jwt').Strategy
const ExtractJWT = require('passport-jwt').ExtractJwt

const validateJWT = () => {
    return new JWTStrategy(
        {
            secretOrKey: 'TOP_SECRET',
            jwtFromRequest: ExtractJWT.fromUrlQueryParameter('secret_token'),
        },
        async (token, done) => {
            try {
                return done(null, token.user)
            } catch (error) {
                done(error)
            }
        },
    )
}

module.exports = validateJWT