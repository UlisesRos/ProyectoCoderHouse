const { Router } = require('express')

class CustomRouter {

    constructor() {
        this.router = Router
        this.init()
    }

    init() {
        // Va a estar vacia en la clase Padre
    }

    getRouter() {
        return this.router
    }

}

module.exports = CustomRouter