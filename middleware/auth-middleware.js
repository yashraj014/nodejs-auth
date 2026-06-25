const jwt = require('jsonwebtoken')

const authMiddleware = async(req,res,next) =>{
//    console.log('Auth middleware triggered!!');
  const authHeader = req.headers['authorization'];
  console.log(authHeader);
  const token = authHeader && authHeader.split(" ")[1];

  if(!token){
    return res.status(401).json({
        error:'Not authenticated'
    })
  }

  try {
    const decodedToken = jwt.verify(token,process.env.SECRET_KEY);
    console.log(decodedToken);
    req.user=decodedToken;
    next();
  } catch (error) {
    return res.status(403).json({ 
        message: "Invalid or Expired Token!" 
    });
  } 
   
}


module.exports=authMiddleware