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
const { logger } = require("@lib/logger");
const { handleErrors } = require("@lib/handle-errors");
const { createApolloFetch } = require('apollo-fetch');


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
const createOrUpdateUserMutation = async (parent, { input }) => {
  // Validate the user input and return errors if any
  const { msg, isValid } = validateUserInput(input);
  if (!isValid) {
    return handleErrors("001", msg);
  }
  //check if user already exists
  let user = await User.findOne({id: input.id});

  try {

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
      return await User.findOne({id: input.id});
    }
    //create new user
    else{
      // Create a user object based on the input
      const newUser = new User({
        id: input.id,
        name: input.name,
        profileUrl: input.profileUrl,
        email: input.email
      });

      //make new user follow itself
      var createFollowshipVariables={
        "input": {
          "followerId": newUser.id,
          "followeeId": newUser.id
        }
      };


      //calls create followship database mutation
      var fetch = createApolloFetch({
        uri: "https://www.memesharer.com:3301/posts"
      });

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


      // Save the user to the database and return
      return newUser.save();
    }

  } catch (err) {
    logger.info(`${err}`);
    return handleErrors("001", { user: err});
  }
};
module.exports = {
  createOrUpdateUserMutation
};
