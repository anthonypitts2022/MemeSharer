const { getDecryptedRefreshTokenSecret } = require('./getDecryptedRefreshTokenSecret')


// Class for analyzing refresh token secret of a signed-in user

class AuthenticateRefreshTokenSecret {
    
    constructor(req){

        const { errors, payload } = getDecryptedRefreshTokenSecret(req);
        
        this.errors = errors;
        this.payload = payload;
    }


};
  


module.exports = { AuthenticateRefreshTokenSecret };