module.exports = async (err, req, res, next)=>{
    if (err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError"){
        let messages = err.errors.map(err => err.message)
        res.status(400).json({ status : 400, messages }) 

    } else {
        if (!err.status) err.status = 500
        res.status(err.status).json({
            status : err.status,
            messages : [err.message]
        })
    }
}