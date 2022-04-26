const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const routes = require('./src/routes');
const middlewares = require('./src/middlewares')

require('./src/auth');
require('./src/configs/moongose')

const app = express();

// view engine setup
app.set('views', path.join(__dirname, './src/views'))
app.set('view engine', 'ejs')

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

Object.values(routes).forEach((route) => app.use(route))
Object.values(middlewares).forEach((middleware) => app.use(middleware))

app.listen(3000, () => {
    console.log('Server started.')
})