module.exports = app => {
    function existsOrError(value, msg) {
        if(!value) throw msg
        if(Array.isArray(value) && value.length === 0) throw msg
        if(typeof value === 'string' && !value.trim()) throw msg
    }

    function notExistsOrError(value, msg) {
        try {
            existsOrError(value, msg)
        }catch(msg){
            return
        }
        throw msg
    }

    function equalsOrError(valueA, valueB, msg) {
        if(valueA !== valueB) throw msg
    }

    function notEqualsOrError(valueA, valueB, msg) {
        if(valueA === valueB) throw msg
    }

    const constructionTimer = (timestamps) => {

        timestamps.forEach(timestamp => {
            t = timestamp.created_at

            date = t.getDay() + '/' + (t.getMonth()+1) + '/' + t.getFullYear()
            if(date.length === 8) date = date.slice(0, 2) + '0' + date.slice(2)

            time = t.getHours() + ':' + t.getMinutes()
            timestamp.created_at = date + ' | ' + time

            if(timestamp.deleted_at){
                t = timestamp.deleted_at

                date = t.getDay() + '/' + (t.getMonth()+1) + '/' + t.getFullYear()
                if(date.length === 8) date = date.slice(0, 2) + '0' + date.slice(2)

                time = t.getHours() + ':' + t.getMinutes()
                timestamp.deleted_at = date + ' | ' + time
            }
        });
        return timestamps
    }

    return {existsOrError, notExistsOrError, equalsOrError, notEqualsOrError, constructionTimer}
}