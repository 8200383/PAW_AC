const { Strategy: LocalStrategy } = require('passport-local')
const AccountSchema = require('../../schemas/AccountSchema')
const signInStrategy = () => {
    return new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
        },
        async (email, password, done) => {
            try {
                const user = await AccountSchema.findOne({ email })

                if (!user) {
                    return done(null, false, { message: 'User not found' })
                }

                /*const validate = await user.isValidPassword(password);

                if (!validate) {
                    return done(null, false, { message: 'Wrong Password' });
                }  */

                return done(null, user, { message: 'Logged in Successfully' })
            } catch (error) {
                return done(error)
            }
        },
    )
}

module.exports = signInStrategy