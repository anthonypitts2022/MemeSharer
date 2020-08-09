const fs = require("fs");
const jwt = require('jsonwebtoken')
const crypto = require('crypto');


// sign and encrypt a JWT corresponding to the refresh token secret
const signEncryptRefreshTokenSecret = async (secret) => {

    try{

      var payload = {
        secret: secret
      };
      
      //200 days in seconds
      var exp = 17280000

      //signing the payload into a jwt
      let signaturePrivateKey = fs.readFileSync(`${process.env.refreshTokenSecretSignaturePrivateKeyFilePath}`, 'utf8');
      let token = jwt.sign(payload, signaturePrivateKey, { algorithm: 'RS256', expiresIn: exp })
      
      //encrypt the JWT
      const encryptionAlgorithm = 'aes-256-cbc';
      const iv = fs.readFileSync(`${process.env.refreshTokenSecretEncryptionIVFilePath}`);
      const encryptAuthKey = fs.readFileSync(`${process.env.refreshTokenSecretEncryptionKeyFilePath}`);
      let cipher = crypto.createCipheriv( encryptionAlgorithm, Buffer.from(encryptAuthKey), iv); 
      let encrypted = cipher.update(token); 
      let encryptedToken = Buffer.concat([encrypted, cipher.final()]).toString('hex');
      
      return encryptedToken;
      
    } catch (err){
        console.log(err);
        return undefined;
    }

};
  
  module.exports = { signEncryptRefreshTokenSecret };