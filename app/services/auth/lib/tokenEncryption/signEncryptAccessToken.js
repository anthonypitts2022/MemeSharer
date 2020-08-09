const fs = require("fs");
const jwt = require('jsonwebtoken')
const crypto = require('crypto');
const { createApolloFetch } = require('apollo-fetch');

//MemeSharer API
const { getUserPerms } = require('../../APIFetches/getUserPerms');


// sign and encrypt a JWT corresponding to the access token
const signEncryptAccessToken = async (userID) => {

    try{
        //get user permissions from Perms Microservice API
        var getUserPermissionsResponse = await getUserPerms(userID)
        
        var unformattedPermissions = getUserPermissionsResponse && getUserPermissionsResponse.data && getUserPermissionsResponse.data.getUserPermissions
    
        var perms = {}
        if(unformattedPermissions){      
            for(var i=0; i<unformattedPermissions.length; i++){
                perms[unformattedPermissions[i]] = true
            }
        }
    
        var payload = {
            user: {
                userID: userID
            },
            perms: perms
        };
        //20 minutes in seconds
        var exp = 1200
    
        //signing the payload into a jwt
        let signaturePrivateKey = fs.readFileSync(`${process.env.accessTokenSignaturePrivateKeyFilePath}`, 'utf8');
        let token = jwt.sign(payload, signaturePrivateKey, { algorithm: 'RS256', expiresIn: exp })
        
        //encrypt the JWT
        const encryptionAlgorithm = 'aes-256-cbc';
        const iv = fs.readFileSync(`${process.env.accessTokenEncryptionIVFilePath}`);
        const encryptAuthKey = fs.readFileSync(`${process.env.accessTokenEncryptionKeyFilePath}`);
        let cipher = crypto.createCipheriv( encryptionAlgorithm, Buffer.from(encryptAuthKey), iv); 
        let encrypted = cipher.update(token); 
        let encryptedToken = Buffer.concat([encrypted, cipher.final()]).toString('hex');
        
        return encryptedToken;
        
    } catch (err){
        console.log(err);
        return undefined;
    }

};
  
  module.exports = { signEncryptAccessToken };