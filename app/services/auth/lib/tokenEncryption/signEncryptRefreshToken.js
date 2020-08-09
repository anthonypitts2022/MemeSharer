const fs = require("fs");
const jwt = require('jsonwebtoken')
const crypto = require('crypto');

// sign and encrypt a JWT corresponding to the refresh token
const signEncryptRefreshToken = async (userID) => {

    try{
    
      var payload = {
        user: {
          userID: userID
        }
      };
      //200 days in seconds
      var exp = 17280000

      //signing the payload into a jwt
      let signaturePrivateKey = fs.readFileSync(`${process.env.refreshTokenSignaturePrivateKeyFilePath}`, 'utf8');
      let token = jwt.sign(payload, signaturePrivateKey, { algorithm: 'RS256', expiresIn: exp })
      
      //encrypt the JWT
      const encryptionAlgorithm = 'aes-256-cbc';
      const iv = fs.readFileSync(`${process.env.refreshTokenEncryptionIVFilePath}`);
      const encryptAuthKey = fs.readFileSync(`${process.env.refreshTokenEncryptionKeyFilePath}`);
      let cipher = crypto.createCipheriv( encryptionAlgorithm, Buffer.from(encryptAuthKey), iv); 
      let encrypted = cipher.update(token); 
      let encryptedToken = Buffer.concat([encrypted, cipher.final()]).toString('hex');
      
      return encryptedToken;

    } catch (err){
        console.log(err);
        return undefined;
    }

};
  
  module.exports = { signEncryptRefreshToken };