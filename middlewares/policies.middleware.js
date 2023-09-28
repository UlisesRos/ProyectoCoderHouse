function policiesCustomer (req, res, next) {

    if(req.user.role !== 'Customer') {
        return res.status(401).send({
            error: "Not a valid user"
        })
    }

    next()
}

function policiesAdmin (req, res, next) {

    if(req.user.role !== 'admin') {
        return res.status(401).send({
            error: "Not a valid user"
        })
    }

    next()
}

module.exports = {
    policiesAdmin,
    policiesCustomer
}