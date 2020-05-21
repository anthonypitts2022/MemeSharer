const fs = require("fs");
const jwt = require('jsonwebtoken')
const crypto = require('crypto');
const { createApolloFetch } = require('apollo-fetch');

//middleware that returns true if user has valid token with proper permissions
//    to this API query/mutation
const signEncryptJWT = async (userID) => {

    try{

        var getUserPermissionsVariables={
            "userID": userID
        };
      
        var fetch = createApolloFetch({
            uri: `${process.env.ssl}://${process.env.website_name}:${process.env.gatewayms_port}/gateway`
        });
    
        //binds the variables for query to fetch
        fetch = fetch.bind(getUserPermissionsVariables)
    
        let getUserPermissionsResponse = await fetch({
            query:
            `
            query getUserPermissions($userID: String!) {
                getUserPermissions(userID: $userID)
            }
            
            `,
            variables: getUserPermissionsVariables
        })
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
    
        //signing the payload into a jwt
        let signaturePrivateKey = fs.readFileSync(`${process.env.signaturePrivateKeyFilePath}`, 'utf8');
        let token = jwt.sign(payload, signaturePrivateKey, { algorithm: 'RS256', expiresIn: '5h' })
        
        //encrypt the JWT
        const encryptionAlgorithm = 'aes-256-cbc';
        const iv = fs.readFileSync(`${process.env.encryptionAuthIVFilePath}`);
        const encryptAuthKey = fs.readFileSync(`${process.env.encryptionAuthKeyFilePath}`);
        let cipher = crypto.createCipheriv( encryptionAlgorithm, Buffer.from(encryptAuthKey), iv); 
        let encrypted = cipher.update(token); 
        let encryptedToken = Buffer.concat([encrypted, cipher.final()]).toString('hex');
        
        return encryptedToken;
    } catch (err){
        //console.log(err);
        return undefined;
    }

};
  
  module.exports = { signEncryptJWT };