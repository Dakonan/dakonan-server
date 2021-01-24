module.exports = async (err, req, res, next)=>{
    if(err.status) {
        res.status(err.status).json({
            message: err.message
        })
    }
    else if (err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError"){
        let messages = err.errors.map(err => err.message)
        res.status(400).json({message: messages[0]}) 

    } else {
        if (!err.status) err.status = 500
        res.status(err.status).json({
            status : err.status,
            messages : [err.message]
        })
    }
}