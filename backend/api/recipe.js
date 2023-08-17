fs = require("fs")

module.exports = app => {
    const {existsOrError, constructionTimer} = app.api.validation

    const save = async (req, res) => {
        const recipe = {...req.body}
        recipe.user_id = req.user.id
        if(req.params.id) recipe.id = req.params.id
        
        try {
            existsOrError(recipe.name, 'Nome não informado')
            existsOrError(recipe.description, 'Descrição necessária não informado')
            existsOrError(recipe.img_verify, 'Imagem de receita necessária')
            existsOrError(recipe.type_id, 'Necessário informar o tipo de receita')
            
            var recipesfromDB
            if(recipe.id){
                recipesfromDB = await app.db('recipes').whereNot('id', recipe.id)
            }else{
                recipesfromDB = await app.db('recipes')
            }
            recipesfromDB.forEach(function(recipefromDB) {
                if(recipefromDB.name === recipe.name)  {throw 'Já existe uma receita com este nome'}
                if(recipefromDB.description === recipe.description){throw 'Descrição da receita já existe'}
            });
        }catch(msg){
            return res.status(400).send(msg)
        }
        
        if(recipe.imageBase64.includes("png;base64,")){
            var base64Data = recipe.imageBase64.replace(/^data:image\/png;base64,/, "");
        }else if(recipe.imageBase64.includes("jpg;base64,")){
            var base64Data = recipe.imageBase64.replace(/^data:image\/jpg;base64,/, "");
        }else{
            var base64Data = recipe.imageBase64.replace(/^data:image\/jpeg;base64,/, "");
        }
        
        const date = new Date()
        recipe.img_location = recipe.user_id + "_" + date.getFullYear() + "_" + date.getDate() + "_" + date.getHours() + "_" + date.getMinutes() + "_" + date.getSeconds() + ".png"
        
        if(recipe.id){
            const recipefromDB = await app.db('recipes').where('id', recipe.id).first()
            fs.unlinkSync("./assets/images/recipes/" + recipefromDB.img_location)
        }
        
        fs.writeFileSync("./assets/images/recipes/" + recipe.img_location, base64Data, 'base64', function(err) {
            if(!err){
                return res.status(400).send(err)
            }
        });
        
        recipe.created_at = date
        recipe.deleted_at = null

        delete recipe.imageBase64
        delete recipe.img_verify
        
        if(recipe.id){
            await app.db('recipes').update(recipe).where({id: recipe.id}).then(_ => res.status(204).send()).catch(err => res.status(500).send(err))
        }else{
            await app.db('recipes').insert(recipe).then(_ => res.status(204).send()).catch(err => res.status(500).send(err))
        }
    }

    const get = async (req, res) => {
        try{
            if(Object.keys(req.params).length === 0){
                recipes = await app.db('recipes as r')
                    .join('users', 'r.user_id', '=', 'users.id')
                    .join('types', 'r.type_id', '=', 'types.id')
                    .select('r.id', 'r.name', 'description', 'img_location', 'r.created_at', 'r.deleted_at', 'users.name as user_id', 'types.name as type_id')
                    .whereNull('r.deleted_at')
                    .whereNull('users.deleted_at')
                    .orderBy('id', 'desc')
                    .limit(3)
                recipes.forEach(function(recipe) {
                    convertImgBase64(recipe)
                });
            }else {
                recipes = await app.db('recipes as r')
                    .join('users', 'r.user_id', '=', 'users.id')
                    .join('types', 'r.type_id', '=', 'types.id')
                    .select('r.id', 'r.name', 'description', 'img_location', 'r.created_at', 'r.deleted_at', 'users.name as user_id', 'types.name as type_id')
                    .orderBy('id')
                
                recipes.forEach(function(recipe) {
                    convertImgBase64(recipe)
                });
            }
            return res.json(constructionTimer(recipes))
        }catch(msg){
            return res.status(400).send(msg)
        }
    }

    const removeRestore = async (req, res) => {
        const recipe = {...req['body']}
        if(req.params.id) recipe.id = req.params.id
        
        recipe.deleted_at = null
        if(recipe.mode === 'remove') {
            recipe.deleted_at = new Date()
        }
        delete recipe['mode']
        
        app.db('recipes').update(recipe).where({id: recipe.id}).then(_ => res.status(204).send()).catch(err => res.status(500).send(err))
        
    }

    const searchRecipes = async (req, res) => {
        const searchPoints = {...req.body}
        
        if(searchPoints.type_id){
            if(typeof searchPoints.type_id !== 'number'){
                delete searchPoints.type_id
            }
        }

        try{
            if(Object.keys(searchPoints).length > 0){
                recipes = await app.db('recipes as r')
                    .join('users', 'r.user_id', '=', 'users.id')
                    .join('types', 'r.type_id', '=', 'types.id')
                    .select('r.id', 'r.name', 'description', 'img_location', 'r.created_at', 'r.deleted_at', 'users.name as user_id', 'types.name as type_id')
                    .whereIn('r.id', function(){
                        if(searchPoints.user_id){
                            this.select('id').from('recipes').where('user_id', searchPoints.user_id)
                        }
                        if(searchPoints.type_id){
                            this.select('id').from('recipes').where('type_id', searchPoints.type_id)
                        }
                        if(searchPoints.name){
                            this.select('id').from('recipes').whereILike('name', `%${searchPoints.name}%`)
                        }
                    })
                    .whereNull('r.deleted_at')
                    .whereNull('users.deleted_at')
                    .orderBy('id')
            }else{
                recipes = await app.db('recipes as r')
                    .join('users', 'r.user_id', '=', 'users.id')
                    .join('types', 'r.type_id', '=', 'types.id')
                    .select('r.id', 'r.name', 'description', 'img_location', 'r.created_at', 'r.deleted_at', 'users.name as user_id', 'types.name as type_id')
                    .whereNull('r.deleted_at')
                    .whereNull('users.deleted_at')
                    .orderBy('id')
                    
            }

            recipes.forEach(function(r) {
                convertImgBase64(r)
            });
            constructionTimer(recipes)
            
            return res.json(recipes)
        }catch(msg){
            return res.status(400).send(msg)
        }
    }

    const convertImgBase64 = (r) => {
        const imageBase64 = fs.readFileSync('./assets/images/recipes/' + r.img_location).toString('base64');
        r.img_location = imageBase64
        return r
    }

    return {save, get, removeRestore, searchRecipes}
}