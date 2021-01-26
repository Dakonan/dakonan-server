module.exports = async (err, req, res, next)=>{
    if(err.status) {
        res.status(err.status).json({
            message: err.message
        })
    } 
    if (err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError"){
        let messages = err.errors.map(err => err.message)
        res.status(400).json({message: messages[0]}) 
    } 
}