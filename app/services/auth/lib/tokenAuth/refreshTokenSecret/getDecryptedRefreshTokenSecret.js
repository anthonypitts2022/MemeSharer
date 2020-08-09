const fs = require("fs");
const jwt = require('jsonwebtoken')
const crypto = require('crypto'); 


function getDecryptedRefreshTokenSecret(req){
    try{       

        const authHeader = req.headers.refreshtokensecret
        const token = authHeader && authHeader.split(' ')[1]    

        if(!token){
            return {
                errors: "No refresh token secret in request header",
                payload: undefined
            }
        }

        //decrypt encrypted token into jwt
        const encryptionAlgorithm = 'aes-256-cbc';
        const iv = fs.readFileSync(`${process.env.refreshTokenSecretEncryptionIVFilePath}`);
        const encryptAuthKey = fs.readFileSync(`${process.env.refreshTokenSecretEncryptionKeyFilePath}`);
        let encryptedText = Buffer.from(token, 'hex');
        let decipher = crypto.createDecipheriv(encryptionAlgorithm, Buffer.from(encryptAuthKey), iv);
        let decrypted = decipher.update(encryptedText);
        let decryptedToken = Buffer.concat([decrypted, decipher.final()]).toString();


        //get the underyling payload from jwt
        let signaturePublicKey = fs.readFileSync(`${process.env.refreshTokenSecretSignaturePublicKeyFilePath}`, 'utf8');
        const payload = jwt.verify(decryptedToken, signaturePublicKey, { algorithms: ['RS256'] })
        
        
        //check verified token for carying payload essentials
        if(!payload || !payload.secret){
            return {
                errors: 'Invalid refresh token secret',
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
                    errors: 'Expired Refresh Token Secret',
                    payload: undefined
                }
            }
        }       
        return {
            errors: "Invalid refresh token secret",
            payload: undefined
        }
    }

}




  module.exports = { getDecryptedRefreshTokenSecret };