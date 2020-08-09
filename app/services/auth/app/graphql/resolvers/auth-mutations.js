//==============================================================================
//                  _        _   _
//  _ __ ___  _   _| |_ __ _| |_(_) ___  _ __
// | '_ ` _ \| | | | __/ _` | __| |/ _ \| '_ \
// | | | | | | |_| | || (_| | |_| | (_) | | | |
// |_| |_| |_|\__,_|\__\__,_|\__|_|\___/|_| |_|
//
//==============================================================================
/*
!Title : user-Mutation
!Auth  : Anthony Pitts
!Vers  : 1.0
!Date  : 6/24/19 *Last Mod
!Desc  : Contains All mutations for Auth Microservice
*/

//==============================================================================
// HEAD
//==============================================================================

//---------------------------------
// Modules
//---------------------------------
require("module-alias/register");
var Base64 = require('js-base64').Base64;
const jwt = require('jsonwebtoken')
const fs = require("fs");
const { handleErrors } = require("@lib/handleErrors");
const { AuthenticateAccessToken } = require('../../../lib/tokenAuth/accessToken/AuthenticateAccessToken')
const { AuthenticateRefreshToken } = require('../../../lib/tokenAuth/refreshToken/AuthenticateRefreshToken')
const { AuthenticateRefreshTokenSecret } = require('../../../lib/tokenAuth/refreshTokenSecret/AuthenticateRefreshTokenSecret')
const { signEncryptAccessToken } = require('../../../lib/tokenEncryption/signEncryptAccessToken')
const { signEncryptRefreshToken } = require('../../../lib/tokenEncryption/signEncryptRefreshToken')
const { signEncryptRefreshTokenSecret } = require('../../../lib/tokenEncryption/signEncryptRefreshTokenSecret')
const { verifyGoogleToken } = require('../../../lib/verifyGoogleToken')
const { nanoid } = require('nanoid')



//---------------------------------
// Models
//---------------------------------
const RefreshToken = require("../../models/RefreshToken-model.js");

//---------------------------------
// Validation
//---------------------------------


//==============================================================================
// BODY
//==============================================================================

// @access : Root
// @desc   : get Access and Refresh Tokens upon google login
const getAuthTokensFromLoginMutation = async (_, { googleToken }, { req, res }) => {
  
  try {

    //verify the integrity of the google token
    var verifiedGoogleToken = await verifyGoogleToken(googleToken)
    if(verifiedGoogleToken.errors){
      console.log(verifiedGoogleToken.errors);
      handleErrors.invalidGoogleToken(verifiedGoogleToken.errors)
    }

    var googleUserID = verifiedGoogleToken.user.id     

    //sign and encrypt JWT accesstoken with user permissions 
    var encryptedAccessToken = await signEncryptAccessToken(googleUserID);
    var accessToken = `Bearer ${encryptedAccessToken}`;

    //sign and encrypt JWT refreshtoken
    var encryptedRefreshToken = await signEncryptRefreshToken(googleUserID);
    var refreshToken = `Bearer ${encryptedRefreshToken}`;

    //sign and encrypt JWT refreshtoken secret
    var refreshTokenSecretString = nanoid()
    var encryptedRefreshTokenSecret = await signEncryptRefreshTokenSecret(refreshTokenSecretString);
    var refreshTokenSecret = `Bearer ${encryptedRefreshTokenSecret}`;


    //If a RefreshToken for this user already exists, update the secret
    //    else, create a new RefreshToken object for this user

    //find a refresh token in the database, DB, with this userID
    var DB_refreshToken = await RefreshToken.findOne({userID: googleUserID});    

    //if there is already a RefreshToken in the DB for this user
    if (DB_refreshToken)
    { 

      var updatedSecret = {
        secret: refreshTokenSecretString
      };
      //update the current secret with the newly generated one
      await RefreshToken.updateOne({ userID: googleUserID }, updatedSecret, {
        new: true
      });

    }
    // if there is no RefreshToken in the DB for this user
    else{

      // Create a RefreshToken object for this user
      const newRefreshToken = new RefreshToken({
        userID: googleUserID,
        secret: refreshTokenSecretString
      });
      // Save the user to the database and return
      await newRefreshToken.save();

    }


    //putting access token, refresh token, and refresh token secret into header up to gateway  
    res.append('accesstoken', accessToken);
    res.append('refreshtoken', refreshToken);
    res.append('refreshtokensecret', refreshTokenSecret);

    return true

  } catch (err) {
    console.log(err);
    return handleErrors.error(err)
  }
};


// @access : Root
// @desc   : Check refresh Token and refresh token secret for new accessToken
const refreshAccessTokenMutation = async (_, __, { req, res }) => {
  
  try {

    //Get the signed-in user's decrypted refresh token payload
    const refreshTokenData = new AuthenticateRefreshToken(req);
    //invalid user refresh token or not signed in
    if(refreshTokenData.errors) 
      return handleErrors.invalidRefreshToken(refreshTokenData.errors)

    //Get the signed-in user's decrypted refresh token's secret payload
    const refreshTokenSecretData = new AuthenticateRefreshTokenSecret(req);
    //invalid user refresh token secret
    if(refreshTokenSecretData.errors) 
      return handleErrors.invalidRefreshTokenSecret(refreshTokenSecretData.errors)

    //if the refresh token and refresh token secret are:
    // correctly signed, have valid payload structure, and not expired

    //check that the refresh token and refresh token secret match a RefreshToken in the DB
    var refreshTokenInDB = await RefreshToken.findOne(
      {
        userID: refreshTokenData.payload.user.userID,
        secret: refreshTokenSecretData.payload.secret
      }
    )

    if(!refreshTokenInDB)
      return handleErrors.invalidRefreshToken('Invalid Refresh Token or Refresh Token Secret')

    //valid refresh token and refresh token secret, proceed to give new access token

    //sign and encrypt JWT accesstoken with user permissions 
    var encryptedAccessToken = await signEncryptAccessToken(refreshTokenData.payload.user.userID);
    var accessToken = `Bearer ${encryptedAccessToken}`;

    //putting new access token into header up to gateway  
    res.append('accesstoken', accessToken);

    return true

  } catch (err) {
    console.log(err);
    return handleErrors.error(err)
  }
};


module.exports = {
  getAuthTokensFromLoginMutation,
  refreshAccessTokenMutation
};
