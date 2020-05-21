const fs = require("fs");
const jwt = require('jsonwebtoken')
const crypto = require('crypto'); 


function getDecryptedToken(req){
    try{       

        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]        

        if(!token){
            return {
                errors: "No auth token in request header",
                authPayload: undefined
            }
        }

        //decrypt encrypted token into jwt
        const encryptionAlgorithm = 'aes-256-cbc';
        const iv = fs.readFileSync(`${process.env.encryptionAuthIVFilePath}`);
        const encryptAuthKey = fs.readFileSync(`${process.env.encryptionAuthKeyFilePath}`);
        let encryptedText = Buffer.from(token, 'hex');
        let decipher = crypto.createDecipheriv(encryptionAlgorithm, Buffer.from(encryptAuthKey), iv);
        let decrypted = decipher.update(encryptedText);
        let decryptedToken = Buffer.concat([decrypted, decipher.final()]).toString();


        //get the underyling payload from jwt
        let signaturePublicKey = fs.readFileSync(`${process.env.signaturePublicKeyFilePath}`, 'utf8');
        const payload = jwt.verify(decryptedToken, signaturePublicKey, { algorithms: ['RS256'] })
        
        
        //check verified token for carying user object essentials
        if(undefined == payload || payload.user==undefined || payload.user.userID==undefined){
            return {
                errors: 'Invalid auth token: User not signed in',
                authPayload: undefined
            }
        }

        // return valid token
        return {
            errors: undefined,
            authPayload: payload
        }

    } catch (err){ 
        if(err){
            //error in verifying the token
            if (err.name === 'TokenExpiredError') {
                return {
                    errors: 'Your token has expired',
                    authPayload: undefined
                }
            }
        }       
        return {
            errors: "Invalid auth token",
            authPayload: undefined
        }
    }

}




  module.exports = { getDecryptedToken };