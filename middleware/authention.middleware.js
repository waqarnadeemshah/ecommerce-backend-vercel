import jwt from "jsonwebtoken";

export const verifyuser=async (req,res,next)=>{
    try {
        const header = req.headers['authorization'];
        const token = header.startsWith('Bearer ') ? header.split(' ')[1] : null
        if(!token){
            return res.status(404).json({sucess:true,msg:"token is not found"})
        }

        const decode=jwt.verify(token,process.env.ACCESSTOKEN)
        req.usertoken=decode;
        
        next()
    } catch (err) {
         res.status(500).json({ sucess: false, error: err.message    });
    }

}
export const verifyadmin=async(req,res,next)=>{
try {
    const header = req.headers["authorization"];
    const token = header && header.startsWith("Bearer ")
      ? header.split(" ")[1]
      : null;

    if (!token) {
      return res.status(401).json({ sucess: false, msg: "Token not found" });
    }

    const decode = jwt.verify(token, process.env.ACCESSTOKEN);

    if (decode.role !== "admin") {
      return res.status(403).json({ sucess: false, msg: "Access denied. Admins only!" });
    }

    req.usertoken = decode; 
    next();
    
} catch (err) {
          res.status(500).json({ sucess: false, error: err.message    });
}
}