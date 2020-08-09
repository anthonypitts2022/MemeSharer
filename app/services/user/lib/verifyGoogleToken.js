const {OAuth2Client} = require('google-auth-library');


//verify the integrity of the google token
const verifyGoogleToken = async (googleToken) => {

    try{
        CLIENT_ID = `${process.env.googleSignInClientID}`

        const client = new OAuth2Client(CLIENT_ID);

        const ticket = await client.verifyIdToken({
            idToken: googleToken,
            audience: CLIENT_ID
        });
        const payload = ticket.getPayload();
        
        
        if(!payload || !payload.name || !payload.sub || !payload.email || !payload.picture){
            var user = undefined
            var errors = {
                invalidToken: 'Invalid google ID token.'
            }
        }
        else{
            var user = {
                name: payload.name,
                id: payload.sub,
                email: payload.email,
                profileUrl: payload.picture
            }
            var errors = undefined
        }

        return {
            user,
            errors
        }

        
    } catch (err){
        var user = undefined
        var errors = {
            invalidToken: 'Invalid google ID token.'
        }
        return {
            user,
            errors
        }
    }

};
  
  module.exports = { verifyGoogleToken };