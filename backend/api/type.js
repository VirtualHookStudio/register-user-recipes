module.exports = app => {
    const {existsOrError, notExistsOrError, constructionTimer} = app.api.validation

    const save = async (req, res) => {
        const type = {...req['body']}
        
        if(req.params.id) type.id = req.params.id
        try {
            existsOrError(type.name, 'Nome não informado')
            
            const typeFromDB = await app.db('types').where({name: type.name}).first()
            if(!type.id) notExistsOrError(typeFromDB, 'Tipo de receita já cadastrado')
        }catch(msg){
            return res.status(400).send(msg)
        }
        
        type.created_at = new Date()
        type.deleted_at = null

        if(type.id){
            app.db('types').update(type).where({id: type.id}).then(_ => res.status(204).send()).catch(err => res.status(500).send(err))
        }else{
            app.db('types').insert(type).then(_ => res.status(204).send()).catch(err => res.status(500).send(err))
        }
    }

    const get = (req, res) => {
        app.db('types')
            .select('id', 'name', 'created_at', 'deleted_at')
            .whereNull('deleted_at')
            .orderBy('id')
            .then(types => res.json(constructionTimer(types)))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        const type = {...req.boby}
        app.db('types')
            .select('id', 'name', 'created_at', 'deleted_at')
            .where({id: type.id})
            .orderBy('id')
            .then(_ => res.status(204))
            .catch(err => res.status(500).send(err))
    }

    const removeRestore = async (req, res) => {
        const type = {...req['body']}
        if(req.params.id) type.id = req.params.id

        try{
            const typesFromDB = await app.db('recipes').where({type_id: type.id}).first()
            notExistsOrError(typesFromDB, 'O tipo de receita não pode ser excluido por que receitas estão cadastradas com este tipo de receita')
        }
        catch(msg){
            return res.status(400).send(msg)
        }
        type.deleted_at = null
        if(type.mode === 'remove') {
            type.deleted_at = new Date()
        }
        delete type['mode']
        app.db('types').update(type).where({id: type.id}).then(_ => res.status(204).send()).catch(err => res.status(500).send(err))
    }

    const typeGetAdmin = (req, res) => {
        app.db('types')
            .select('id', 'name', 'created_at', 'deleted_at')
            .orderBy('id')
            .then(types => res.json(constructionTimer(types)))
            .catch(err => res.status(500).send(err))
    }

    return {save, get, getById,removeRestore, typeGetAdmin}
}