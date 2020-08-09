const { getDecryptedAccessToken } = require('./getDecryptedAccessToken')


// Class for checking permissions of a signed-in user

class AuthenticateAccessToken {
    
    constructor(req){

        const { errors, payload } = getDecryptedAccessToken(req);
        
        this.errors = errors;
        this.payload = payload;
    }

    hasMatchingUserID(userID){             
        try{
            return this.payload.user.userID==userID
        } catch (err){
            return false
        }
    }

    hasPermission(permission){
        try{
            return this.payload.perms[permission]
        } catch(err){
            return false
        }
    }


};
  


module.exports = { AuthenticateAccessToken };