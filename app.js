const express = require('express')
const routes = require('./src/routes')
const middlewares = require('./src/middlewares')

const framework = express()

const { http, paths, database, auth } = require('./src/configs')

http(framework)
paths(framework)
auth(framework)

database
    .then(() => console.info('MongoDB connected'))
    .catch((e) => console.error(e))

Object.values(routes).forEach((route) => framework.use(route))
Object.values(middlewares).forEach((middleware) => framework.use(middleware))

framework.listen(3000, () => {
    console.log('Server started')
})