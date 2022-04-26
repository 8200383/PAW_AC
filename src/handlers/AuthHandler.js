const passport = require('passport');
const jwt = require('jsonwebtoken');

const signUp = async (req, res, next) => {
    res.json({
        message: 'Signup successful',
        user: req.user
    });
}

const signIn = async (req, res, next) => {
    return passport.authenticate(
        'login',
        async (err, user, info) => {
            try {
                if (err || !user) {
                    const error = new Error('An error occurred.');

                    return next(error);
                }

                req.login(
                    user,
                    { session: false },
                    async (error) => {
                        if (error) return next(error);

                        const body = { _id: user._id, email: user.email };
                        const token = jwt.sign({ user: body }, 'TOP_SECRET');

                        return res.json({ token });
                    }
                );
            } catch (error) {
                return next(error);
            }
        }
    )(req, res, next);
}

module.exports = {
    signUp,
    signIn
}