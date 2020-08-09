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
!Desc  : Contains All mutations for Users
*/

//==============================================================================
// HEAD
//==============================================================================

//---------------------------------
// Modules
//---------------------------------
require("module-alias/register");
var Base64 = require('js-base64').Base64;
const { handleErrors } = require("@lib/handleErrors");
const { AuthenticateAccessToken } = require('../../../lib/AuthenticateAccessToken')
const { verifyGoogleToken } = require('../../../lib/verifyGoogleToken')
const { createFollowship } = require('../../../APIFetches/createFollowship')


//---------------------------------
// Models
//---------------------------------
const User = require("../../models/User-model.js");

//---------------------------------
// Validation
//---------------------------------
const validateUserInput = require("../../validation/validateUserInput.js");

//==============================================================================
// BODY
//==============================================================================

// @access : Root
// @desc   : Create Or Updates a single user
const createOrUpdateUserMutation = async (_, { googleToken }, { req, res }) => {
  
  try {  

    //Get the signed-in user's decrypted auth token payload
    const accessTokenData = new AuthenticateAccessToken(req);

    //'invalid user auth token or not signed in'
    if(accessTokenData.errors) return handleErrors("001", accessTokenData.errors)

    //verify the integrity of the google token
    var verifiedGoogleToken = await verifyGoogleToken(googleToken)
    if(verifiedGoogleToken.errors){
      console.log(verifiedGoogleToken.errors);
      return handleErrors.invalidGoogleToken(verifiedGoogleToken.errors)
    }

    var googleUser = verifiedGoogleToken.user    

    //if signed in user doesn't match the userId of the user being created/updated
    if(!accessTokenData.hasMatchingUserID(googleUser.id)) 
      return handleErrors.permissionDenied('Signed in user does not match the user being created/updated')

    //check if user already exists    
    var user = await User.findOne({id: googleUser.id});    

    let createdOrUpdatedUser; //the user object that will get returned

    //update user info
    if (user)
    {
      //collect fields to be updated
      let updateRecord = {};
      for (let field in googleUser){
        if(googleUser.hasOwnProperty(field) && field!="id"){
          updateRecord[field] = googleUser[field];
        }
      }

      //update database
      let update = await User.updateOne({ id: googleUser.id }, updateRecord, {
        new: true
      });

      // Database response after record has been created
      createdOrUpdatedUser = await User.findOne({id: googleUser.id});
    }
    //create new user
    else{
      // Create a user object based on the googleUser
      const newUser = new User({
        id: googleUser.id,
        name: googleUser.name,
        profileUrl: googleUser.profileUrl,
        email: googleUser.email
      });
    
      // Save the user to the database and return
      createdOrUpdatedUser = await newUser.save();

      //have the new user follow themself
      await createFollowship(googleUser.id, googleUser.id)

    }    
   

    return await createdOrUpdatedUser;

  } catch (err) {
    console.log(err);
    return handleErrors.error(err);
  }
};


module.exports = {
  createOrUpdateUserMutation
};
