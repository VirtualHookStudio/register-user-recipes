const {authSecret} = require('../.env')
const jwt = require('jwt-simple')
const bcrypt = require('bcryptjs')

module.exports = app => {
    const signin = async (req, res) => {
        if (!req.body.email || !req.body.password) {
            return res.status(400).send('Informe usuário e senha!')
        }

        const user = await app.db('users')
            .where({email: req.body.email})
            .whereNull('deleted_at')
            .first()

        if (!user) return res.status(400).send('Email ou senha incorretos!')
        const isMatch = bcrypt.compareSync(req.body.password, user.password)
        if (!isMatch) return res.status(400).send('Email ou senha incorretos!')

        const now = Math.floor(Date.now() / 1000)
        const payload = {
            id: user.id,
            user_icon: user.user_icon,
            name: user.name,
            email: user.email,
            permission: user.permission,
            iat: now,
            exp: now + (60 * 60 * 24)
        }
        res.json({
            ...payload, token: jwt.encode(payload, authSecret)
        })
    }

    const validateToken = async (req, res) => {
        const userData = req.body || null
        try {
            if(userData) {
                const token = jwt.decode(userData.token, authSecret)
                if( new Date(token.exp * 1000) > new Date()) {
                    return res.send(true)
                }
            }
        } catch (e) {

        }

        res.send(false)
    }

    const convertImgBase64 = (u) => {
        const imageBase64 = fs.readFileSync('./assets/images/users/' + u.user_icon).toString('base64');
        u.user_icon = imageBase64
        return u
    }

    return {signin, validateToken}
}