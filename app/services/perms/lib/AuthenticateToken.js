const { getDecryptedToken } = require('./getDecryptedToken')


// Class for checking permissions of a signed-in user

class AuthenticateToken {
    
    constructor(req){

        const { errors, authPayload } = getDecryptedToken(req);
        
        this.errors = errors;
        this.authPayload = authPayload;
    }

    hasMatchingUserID(userID){     
        try{
            return this.authPayload.user.userID==userID
        } catch (err){
            return false
        }
    }

    hasPermission(permission){
        try{
            return this.authPayload.perms[permission]==true
        } catch(err){
            return false
        }
    }


};
  


module.exports = { AuthenticateToken };