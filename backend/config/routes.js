const admin = require('./admin')

module.exports = app => {
    app.post('/signup', app.api.user.save)
    app.post('/signin', app.api.auth.signin)
    app.post('/validateToken', app.api.auth.validateToken)

    app.route('/users')
        .all(app.config.passport.authenticate())
        .post(app.api.user.save)
        .put(app.api.user.get)
        .get(app.api.user.get)

    app.route('/users/:id')
        .all(app.config.passport.authenticate())
        .put(app.api.user.save)
        .post(app.api.user.removeRestore)

    app.route('/userprofile')
        .all(app.config.passport.authenticate())
        .get(app.api.user.profile)

    app.route('/recipes')
        .all(app.config.passport.authenticate())
        .post(app.api.recipe.save)
        .get(app.api.recipe.get)
    
    app.route('/recipes/:id')
        .all(app.config.passport.authenticate())
        .get(app.api.recipe.get)
        .put(app.api.recipe.save)
        .post(app.api.recipe.removeRestore)
    
    app.route('/types')
        .all(app.config.passport.authenticate())
        .post(admin(app.api.type.save))
        .get(app.api.type.get)
    
    app.route('/types/:id')
        .all(app.config.passport.authenticate())
        .put(admin(app.api.type.save))
        .get(admin(app.api.type.getById))
        .post(admin(app.api.type.removeRestore))

    app.route('/typeGetAdmin')
        .all(app.config.passport.authenticate())
        .get(admin(app.api.type.typeGetAdmin))
    
    app.route('/searchrecipes')
        .all(app.config.passport.authenticate())
        .post(app.api.recipe.searchRecipes)

    app.route('/imgProfileIconUser')
        .all(app.config.passport.authenticate())
        .get(app.api.user.imgProfileIconUser)
}