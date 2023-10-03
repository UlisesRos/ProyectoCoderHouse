const EErrors = require('../errors/enum.error')

function handleError (error, req, res, next) {
    console.log(error.cause)
    switch (error.code) {
        case EErrors.ID_INEXISTENTE:
            res.status(error.statusCode).send({
                status: error.statusCode,
                error: error.name,
                message: error.message
            })
            break;
        case EErrors.CAMPOS_OBLIGATORIOS:
            res.status(error.statusCode).send({
                status: error.statusCode,
                error: error.name,
                message: error.message
            })
            break;
        case EErrors.PRODUCTO_EXISTENTE:
            res.status(error.statusCode).send({
                status: error.statusCode,
                error: error.name,
                message: error.message
            })
            break;
    
        default:
            res.send({
                status: 'error',
                error: 'Unhandled error'
            })
    }
}

module.exports = handleError