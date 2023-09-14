const userManager = require('../../dao/managersMongo/user.manager')

class UserController {

    // Mostrar usuarios
    async getUsers (req, res) {

        const { email } = req.query
    
        if(email){
            
            const emailVer = await userManager.getUsers()
            if(emailVer.find(em => em.email == email)){
                const userEmail = await userManager.getUserByEmail(email)
                res.send(userEmail)
                return
            }
            
            res.status(404).send({
                error: 'EMAIL INEXISTENTE'
            })
        } else{
            const users = await userManager.getUsers()
            res.send(users)
        }
    
    }

    // Mostrar usuarios por ID
    async getUserById (req, res) {
        const { id } = req.params
    
        try {
            const userId = await userManager.getUserById( id )
            if(!userId){
                res.status(404).send({
                    Error: 'ID DEL USUARIO INEXISTENTE'
                })
                return
            }
    
            res.send(userId)
        } catch (error) {
            console.log(error)
            res.status(500).send({ error: 'Ocurrio un error en el sistema'})
        }
    
    }

    // Creacion de Usuario
    async addUser (req, res) {

        const { body } = req
        const users = await userManager.getUsers()
    
        if(!body.first_name || !body.last_name || !body.email || !body.age || !body.password){
            res.status(400).send({
                error: 'Todos los campos son obligatorios'
            })
        } else if(users.find(us => us.email == body.email)){
            res.status(400).send({
                error: 'El email ya existe.'
            })
        } else{
    
            await userManager.addUser( body )
            res.status(201).send({
                Created: `El usuario ha sido creado con exito. ¡Bienvenido ${body.last_name}!`
            })
    
        }
    
    }

    // Modificar Usuarios
    async updateUser (req, res) {

        const { id } = req.params
        const { body } = req
    
        try {
    
            const user = await userManager.updateUser(id, body)
            if(user.matchedCount >= 1){
                res.status(202).send({Accepted: `El usuario con id: ${id} ha sido modificado.`})
                return
            }
            
            res.status(404).send({
                error: 'ID INEXISTENTE'
            })
    
        } catch (error) {
            res.status(500).send({
                message: 'Ha ocurrido un error en el servidor',
                exception: error.stack
            })
        }
    
    }

    // Eliminar usuario
    async deleteUser (req, res) {

        const { id } = req.params
    
        try {
            
            const user = await userManager.deleteUser( id )
            if(user.deletedCount >= 1){
                res.status(202).send({
                    Accepted: `El usuario con id: ${id} ha sido eliminado`
                })
                return
            }
    
            res.status(404).send({
                error: 'ID INEXISTENTE'
            })
    
        } catch (error) {
            res.status(500).send({
                message: 'Ha ocurrido un error en el servidor',
                exception: error.stack
            })
        }
    
    }

}

module.exports = new UserController()