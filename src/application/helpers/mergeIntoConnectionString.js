function mergeIntoConnectionString(mongo) {
    return `mongodb+srv://${mongo.username}:${mongo.password}@${mongo.url}/${mongo.database}?retryWrites=true&w=majority`
}

module.exports = mergeIntoConnectionString