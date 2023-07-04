const {connect} = require('mongoose')

class MongoSingleton {
    static #instance 
    constructor(){
        console.log(process.env.MONGO_URL)
        connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
    }
    static getInstance(){
        if (this.#instance) {
            console.log('This database already exists')
            return this.#instance
        }
        this.#instance = new MongoSingleton()
        console.log('Database created')
        return this.#instance
    }
}

module.exports = {
    MongoSingleton
}
