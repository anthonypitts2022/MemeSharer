const fs = require("fs");
const jwt = require('jsonwebtoken')
const crypto = require('crypto'); 


function getDecryptedAccessToken(req){
    try{  

        const authHeader = req.headers.accesstoken        
        const token = authHeader && authHeader.split(' ')[1]
              
        if(!token){
            return {
                errors: "No access token in request header",
                payload: undefined
            }
        }

        //decrypt encrypted token into jwt
        const encryptionAlgorithm = 'aes-256-cbc';
        const iv = fs.readFileSync(`${process.env.accessTokenEncryptionIVFilePath}`);
        const encryptAuthKey = fs.readFileSync(`${process.env.accessTokenEncryptionKeyFilePath}`);
        let encryptedText = Buffer.from(token, 'hex');
        let decipher = crypto.createDecipheriv(encryptionAlgorithm, Buffer.from(encryptAuthKey), iv);
        let decrypted = decipher.update(encryptedText);
        let decryptedToken = Buffer.concat([decrypted, decipher.final()]).toString();


        //get the underyling payload from jwt
        let signaturePublicKey = fs.readFileSync(`${process.env.accessTokenSignaturePublicKeyFilePath}`, 'utf8');
        const payload = jwt.verify(decryptedToken, signaturePublicKey, { algorithms: ['RS256'] })
        
        
        //check verified token for carying user object essentials
        if(!payload || !payload.user || !payload.user.userID){
            return {
                errors: 'Invalid access token: User not signed in',
                payload: undefined
            }
        }

        // return valid token
        return {
            errors: undefined,
            payload: payload
        }

    } catch (err){         
        if(err){
            //error in verifying the token
            if (err.name === 'TokenExpiredError') {
                return {
                    errors: 'Expired Access Token',
                    payload: undefined
                }
            }
        }       
        return {
            errors: "Invalid access token",
            payload: undefined
        }
    }

}




  module.exports = { getDecryptedAccessToken };