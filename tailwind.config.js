module.exports = {
    content: ['./src/views/**/*.ejs', './public/javascripts/**/*.js'],
    theme: {
        extend: {},
    },
    plugins: [
        require('@tailwindcss/forms'),
    ],
}
