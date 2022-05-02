module.exports = {
    content: ['./src/views/**/*.ejs', './public/javascripts/**/*.js', './public/forms/**/*.ejs'],
    theme: {
        extend: {},
    },
    plugins: [
        require('@tailwindcss/forms'),
    ],
}
