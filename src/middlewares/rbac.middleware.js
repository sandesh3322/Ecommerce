const hasPermission = (accessedby = null) => {
  return(req, res, next) => {
    try{
      const user = req.authuser || null;
      if(!user){
        throw {status : 401 , message: "please login first "}
      }
    if(accessedby === null){
      next();
    }
      if((typeof accessedby ==='string' && accessedby === user.role)||(Array.isArray(accessedby)&& accessedby.includes(user.role)) ){
        next()
      }else{
        throw{status: 403, message:"you do not have access to this resource."}
      }
    }catch(exception){
      next(exception);
    }
  }
} 
module.exports = hasPermission;