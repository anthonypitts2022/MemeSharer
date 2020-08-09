const { getDecryptedRefreshToken } = require('./getDecryptedRefreshToken')


// Class for analyzing refresh token of a signed-in user

class AuthenticateRefreshToken {
    
    constructor(req){

        const { errors, payload } = getDecryptedRefreshToken(req);
        
        this.errors = errors;
        this.payload = payload;
    }

};
  


module.exports = { AuthenticateRefreshToken };