var jwt = require("jsonwebtoken");
const JWT_SECRET = "jatin";
const fetchUser=(req,res,next)=>{
    const token=req.header('auth-token')
    if(!token)
    {
        return res.status(401).send("Please Login with valid Token")
    }
    else
    {
        const data=jwt.verify(token,JWT_SECRET);
        req.id=data.id;
        next();
        
        

    }
}
module.exports=fetchUser;