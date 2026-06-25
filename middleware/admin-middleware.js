

const adminMiddleware = (req,res,next)=>{
    if(req.user.role!=='admin'){
        return res.status(403).json({
            message:'Acess Denied, Admin rights required!'
        })
    }
    next();
}

module.exports = adminMiddleware