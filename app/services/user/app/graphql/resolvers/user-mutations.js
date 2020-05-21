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
const jwt = require('jsonwebtoken')
const fs = require("fs");
const { handleErrors } = require("@lib/handle-errors");
const { createApolloFetch } = require('apollo-fetch');
const { addReqHeaders } = require('../../../lib/addReqHeaders.js')
const { authenticateToken } = require('../../../lib/AuthenticateToken')
const { signEncryptJWT } = require('../../../lib/signEncryptJWT')
const crypto = require('crypto');


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
const createOrUpdateUserMutation = async (parent, { input }, { req, res }) => {
  
  try {

    // Validate the user input and return errors if any
    const { msg, isValid } = validateUserInput(input);
    if (!isValid) 
      return handleErrors("001", msg);

    //check if user already exists    
    var user = await User.findOne({id: input.id});    

    let createdOrUpdatedUser; //the user object that will get returned

    //update user info
    if (user)
    {
      //collect fields to be updated
      let updateRecord = {};
      for (let field in input){
        if(input.hasOwnProperty(field) && field!="id"){
          updateRecord[field] = input[field];
        }
      }

      //update database
      let update = await User.updateOne({ id: input.id }, updateRecord, {
        new: true
      });

      // Database response after record has been created
      
      
      createdOrUpdatedUser = await User.findOne({id: input.id});
    }
    //create new user
    else{
      try{
      // Create a user object based on the input
      const newUser = new User({
        id: input.id,
        name: input.name,
        profileUrl: input.profileUrl,
        email: input.email
      });
    
      // Save the user to the database and return
      createdOrUpdatedUser = await newUser.save();

      }catch(err){
        //console.log(err);
      }
    }    

    //sign and encrypt JWT with user permissions 
    let encryptedToken = await signEncryptJWT(createdOrUpdatedUser.id);

    //putting encryptedToken into header    
    res.append('Authorization', `Bearer ${encryptedToken}`);  
    
    
    //have the new user follow themselves
    if(!user){
      try{        
        //make new user follow itself
        var createFollowshipVariables={
          "input": {
            "followerId": input.id,
            "followeeId": input.id
          }
        };        

        //calls create followship database mutation
        var fetch = createApolloFetch({
          uri: `${process.env.ssl}://${process.env.website_name}:${process.env.gatewayms_port}/gateway`
        });
        //sets the authorization request header
        addReqHeaders(fetch, `Bearer ${encryptedToken}`);

        //binds the variables for query to fetch
        fetch = fetch.bind(createFollowshipVariables)

        let createFollowshipResponse = await fetch({
          query:
          `
          mutation createFollowship($input: followshipInput!){
            Followship: createFollowship(input: $input){
              followerId
              followeeId
            }
          }
          `,
          variables: createFollowshipVariables
        })
      } catch (err) {
        console.log('Failed to have new user follow themself.')
      }
    }

    return await createdOrUpdatedUser;

  } catch (err) {
    //console.log(err);
    return handleErrors("001", { user: err});
  }
};


module.exports = {
  createOrUpdateUserMutation
};
