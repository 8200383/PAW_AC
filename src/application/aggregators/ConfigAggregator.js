class ConfigAggregator {

    constructor(modules) {
        this.views = []
        this.apiSpecifications = []
        this.routes = []

        modules.map((m) => {
            this.retriveDependencies(m)
            console.info(`[!] New module "${m.name}" loaded`)
        })
    }

    retriveDependencies(module) {
        this.views.push(module.views)
        this.apiSpecifications.push(module.swagger)
        this.routes.push(module.routes)
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