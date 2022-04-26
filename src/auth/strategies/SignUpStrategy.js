const { Strategy: LocalStrategy } = require('passport-local')
const AccountSchema = require('../../schemas/AccountSchema')

const signUpStrategy = () => {
    return new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
        },
        async (email, password, done) => {
            try {
                const user = await AccountSchema.create({ email, password })

                return done(null, user)
            } catch (error) {
                done(error)
            }
        },
    )
}

module.exports = signUpStrategy