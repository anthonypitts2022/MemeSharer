const fs = require("fs");
const jwt = require('jsonwebtoken')
const crypto = require('crypto'); 


function getDecryptedRefreshToken(req){
    try{       

        const authHeader = req.headers.refreshtoken
        const token = authHeader && authHeader.split(' ')[1]    

        if(!token){
            return {
                errors: "No refresh token in request header",
                payload: undefined
            }
        }

        //decrypt encrypted token into jwt
        const encryptionAlgorithm = 'aes-256-cbc';
        const iv = fs.readFileSync(`${process.env.refreshTokenEncryptionIVFilePath}`);
        const encryptAuthKey = fs.readFileSync(`${process.env.refreshTokenEncryptionKeyFilePath}`);
        let encryptedText = Buffer.from(token, 'hex');
        let decipher = crypto.createDecipheriv(encryptionAlgorithm, Buffer.from(encryptAuthKey), iv);
        let decrypted = decipher.update(encryptedText);
        let decryptedToken = Buffer.concat([decrypted, decipher.final()]).toString();


        //get the underyling payload from jwt
        let signaturePublicKey = fs.readFileSync(`${process.env.refreshTokenSignaturePublicKeyFilePath}`, 'utf8');
        const payload = jwt.verify(decryptedToken, signaturePublicKey, { algorithms: ['RS256'] })
        
        
        //check verified token for carying payload essentials
        if(!payload || !payload.user || !payload.user.userID){
            return {
                errors: 'Invalid refresh token: User not signed in',
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
                    errors: 'Expired Refresh Token',
                    payload: undefined
                }
            }
        }       
        return {
            errors: "Invalid refresh token",
            payload: undefined
        }
    }

}




  module.exports = { getDecryptedRefreshToken };