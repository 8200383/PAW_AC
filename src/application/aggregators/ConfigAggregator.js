const express = require('express')

class ConfigAggregator {

    constructor(modules) {
        this.views = []
        this.apiSpecifications = []
        this.swaggerFiles = []
        this.routes = []

        modules.map((m) => {
            this.retriveDependencies(m)
            console.info(`[!] New module "${m.name}" loaded`)
        })
    }

    retriveDependencies(module) {
        this.views.push(module.views)

        const swaggerPath = `/${module.name.toLowerCase()}.json`

        this.apiSpecifications.push({
            url: `http://localhost:3000${swaggerPath}`,
            name: module.name,
        })

        this.swaggerFiles.push({
            route: swaggerPath,
            file: express.static(module.swagger),
        })

        this.routes.push(module.routes)
    }

    getSwaggerFiles() {
        return this.swaggerFiles
    }

    getMergedViews() {
        return this.views
    }

    getMergedRoutes() {
        return this.routes
    }

    getMergedApiSpecifications() {
        return this.apiSpecifications
    }
}

module.exports = ConfigAggregator