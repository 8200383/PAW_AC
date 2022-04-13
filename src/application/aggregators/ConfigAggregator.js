const express = require('express')

class ConfigAggregator {

    constructor(modules) {
        this.views = []
        this.routes = []

        modules.map((m) => {
            this.retriveDependencies(m)
            console.info(`[!] New module "${m.name}" loaded`)
        })
    }

    retriveDependencies(module) {
        this.views.push(module.views)
        this.routes.push(module.routes)
    }

    getMergedViews() {
        return this.views
    }

    getMergedRoutes() {
        return this.routes
    }
}

module.exports = ConfigAggregator