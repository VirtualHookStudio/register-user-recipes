module.exports = middlewares => {
    return (req, res, next) => {
        if(req.user.permission === true) {
            middlewares(req, res, next)
        }else {
            res.status(401).send("Usuário não tem permissão")
        }
    }
}