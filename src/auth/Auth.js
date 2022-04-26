const passport = require('passport')

const { SignInStrategy, SignUpStrategy } = require('./strategies')
const { JWTValidator } = require('./validators')

passport.use('signup', SignUpStrategy)
passport.use('signin', SignInStrategy)

passport.use(JWTValidator)

module.exports = passport