const bcrypt = require('bcryptjs')
fs = require("fs")

module.exports = app => {
    const {existsOrError, notEqualsOrError, equalsOrError, constructionTimer} = app.api.validation

    const encryptPassword = password => {
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(password, salt)
    }

    const save = async (req, res) => {
        const user = {...req.body}
        if(req.params.id) user.id = req.params.id
        
        try {
            existsOrError(user.name, 'Nome não informado')
            existsOrError(user.email, 'E-mail não informado')
            existsOrError(user.phone, 'Telefone não informado')
            existsOrError(user.cpf, 'CPF não informado')
            
            userFromDB = await app.db('users').where({email: user.email}).orWhere({cpf: user.cpf}).orWhere({phone: user.phone}).orWhere({name: user.name}).first()
            if(user.id){
                if(user.id == userFromDB.id){
                    userFromDB = {}
                }
            }
            
            if(userFromDB){
                notEqualsOrError(userFromDB.name, user.name, 'Usuário já registrado!')
                notEqualsOrError(userFromDB.email, user.email, 'Email já registrado!')
                notEqualsOrError(userFromDB.phone, user.phone, 'Telefone já registrado!')
                notEqualsOrError(userFromDB.cpf, user.cpf, 'CPF já registrado!')
            }
            
            if(!user.id) {
                existsOrError(user.password, 'Senha não informada')
                existsOrError(user.confirmPassword, 'Confirmação de senha inválida')
                equalsOrError(user.password, user.confirmPassword, 'Confirmação de senha inválida')
            }else {
                if(user.confirmPassword || user.password){
                    existsOrError(user.confirmPassword, 'Confirmação de senha inválida')
                    equalsOrError(user.password, user.confirmPassword, 'Confirmação de senha inválida')
                    user.password = encryptPassword(user.password)
                    delete user.confirmPassword
                }
                
                if(user.img_verify){
                    if(user.imageBase64.includes("png;base64,")){
                        var base64Data = user.imageBase64.replace(/^data:image\/png;base64,/, "");
                    }else if(user.imageBase64.includes("jpg;base64,")){
                        var base64Data = user.imageBase64.replace(/^data:image\/jpg;base64,/, "");
                    }else{
                        var base64Data = user.imageBase64.replace(/^data:image\/jpeg;base64,/, "");
                    }
                    
                    const date = new Date()
                    user.user_icon = user.id + "_" + date.getFullYear() + "_" + date.getDate() + "_" + date.getHours() + "_" + date.getMinutes() + "_" + date.getSeconds() + ".png"

                    const userfromDB = await app.db('users').where('id', user.id).first()
                    if(userfromDB.user_icon !== '@/assets/genericIcon.png'){
                        fs.unlinkSync("./assets/images/users/" + userfromDB.user_icon)
                    }

                    fs.writeFileSync("./assets/images/users/" + user.user_icon, base64Data, 'base64', function(err) {
                        if(!err){
                            return res.status(400).send(err)
                        }
                    });
                }else{
                    delete user.user_icon
                }
            }
        }catch(msg){
            return res.status(400).send(msg)
        }
        
        if(user.id){
            delete user.img_verify
            delete user.imageBase64
            app.db('users').update(user).where({id: user.id}).then(_ => res.status(204).send()).catch(err => res.status(500).send(err))
        }else{
            user.password = encryptPassword(user.password)
            delete user.confirmPassword
            user.user_icon = '@/assets/genericIcon.png'
            user.created_at = new Date()
            user.deleted_at = null

            app.db('users').insert(user).then(_ => res.status(204).send()).catch(err => res.status(500).send(err))
        }
    }

    const get = async (req, res) => {
        await app.db('users')
                .orderBy('id')
                .then(users => res.json(constructionTimer(users)))
                .catch(err => res.status(500).send(err))
    }

    const profile = async (req, res) => {
        
        try{
            user = await app.db('users as u')
                .select('u.id', 'u.name', 'u.user_icon', 'u.email', 'u.phone', 'u.cpf', 'u.created_at', 'u.deleted_at')
                .where({id: req.user.id})
                .first()

            if(user.user_icon !== '@/assets/genericIcon.png'){
                convertImgBase64(user)
            }
            return res.json(user)
        }catch(msg){
            return res.status(500).send(msg)
        }
    }

    const removeRestore = async (req, res) => {
        const user = {...req['body']}
        if(req.params.id) user.id = req.params.id
        if(user.id !== 1){
            user.deleted_at = null

            if(user.mode === 'remove') {
                const recipes = user.deleted_at = new Date()

                await app.db('recipes').update({deleted_at: recipes}).where({user_id: user.id})
            }
            delete user['mode']

            app.db('users').update(user).where({id: user.id}).then(_ => res.status(204).send()).catch(err => res.status(500).send(err))
        }
    }

    const imgProfileIconUser = async (req, res) => {
        try{
            const user = await app.db('users').where({id: req.user.id}).first()
            if(user.user_icon !== '@/assets/genericIcon.png'){
                convertImgBase64(user)
            }
            
            return res.json(user.user_icon)
        }catch(msg){
            return res.status(500).send(msg)
        }
    }

    const convertImgBase64 = (u) => {
        const imageBase64 = fs.readFileSync('./assets/images/users/' + u.user_icon).toString('base64');
        u.user_icon = imageBase64
        return u
    }

    return {save, get, removeRestore, profile, imgProfileIconUser}
}