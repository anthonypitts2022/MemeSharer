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
!Auth  : aep2195
!Vers  : 1.0
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
const { generatePassword } = require("@lib/passGen");
const config = require("../../../config/config.js");
const bcrypt = require("bcrypt");
const path = require("path");
const axios = require("axios");


//---------------------------------
// Models
//---------------------------------
const User = require("../../models/User-model.js");
const Follower = require("../../models/Follower-model.js");

//---------------------------------
// Validation
//---------------------------------
const validateUserInput = require("../../validation/validateUserInput.js");
const validateFollowerInput = require("../../validation/validateFollowerInput.js");

//==============================================================================
// Create User
//==============================================================================

// @access : Root
// @desc   : Create a single user
const createUserMutation = async (parent, { input }) => {
  // Validate the user input and return errors if any
  const { msg, isValid } = validateUserInput(input);
  if (!isValid) {
    return handleErrors("001", msg);
  }

  // Initiate the models by finding if the fields below exist
  var userCount = await User.countDocuments({ email: input.email });

  try {

    if (userCount!=0) return handleErrors("001",{email: "User already exists!"} );

    // Create a user object based on the input
    const newUser = new User({
      email: input.email,
      name: input.name,
      password: input.password
    });

    // Encrypt the user password
    // Once it has been encrypted, create the new password
    const saltRounds = 10;
    const hashedPassword = await new Promise((resolve, reject) => {
      bcrypt.hash(newUser.password, saltRounds, function(err, hash) {
        if (err) reject(err);
        resolve(hash);
      });
    });
    newUser.password = hashedPassword;

    // Save the user to the database
    return newUser.save();



    //make it so the user is following themself (so they can see their own posts)
    const newFollower = new Follower({
      userFollowingId: newUser.id,
      userBeingFollowedId: newUser.id
    });

    // Save the follower to the database
    return newFollower.save();


  } catch (err) {
    logger.info(`${err}`);
    // Database response after user has been created
    if (user) {
      return handleErrors("001", { email: "User already exists!" });
    }
  }
};


//==============================================================================
// Create Follower
//==============================================================================

// @access : Root
// @desc   : Create a follower
const createFollowerMutation = async (parent, { input }, {user} ) => {
  // Validate the user input and return errors if any
  const { msg, isValid } = validateFollowerInput(input);
  if (!isValid) {
    return handleErrors("001", msg);
  }

  try {

    // Initiate the models by finding if the fields below exist
    var followObjectCount = await Follower.countDocuments({
      userFollowingId: user.id,
      userBeingFollowedId: input.userBeingFollowedId
    });
    //if user is already follwing this user
    if (followObjectCount!=0) return handleErrors("001",{follower: "Already Following"} );

    //checks that user is not following more than 5,000 users
    if(5000< (await Follower.countDocuments({userFollowingId:user.id})) ){
      return handleErrors("001",{follower: "Attempting to surpass max following count"} );
    }

    // Create a follower object based on the input
    const newFollower = new Follower({
      userFollowingId: user.id,
      userBeingFollowedId: input.userBeingFollowedId
    });

    // Save the follower to the database
    return newFollower.save();
  } catch (err) {
    logger.error(e.message);
    // Database response after user has been created
    if (user) {
      return handleErrors("001", { follower: "failed to create follower" });
    }
  }
};


//==============================================================================
// Delete All Users
//==============================================================================

// @access : Private, User
// @desc   : Delete all Users Objects
const deleteAllUsersMutation = async (parent, { isActual }, {user}) => {
  try{
    await User.deleteMany();
    return true;
  } catch (err) {
    // Database response after post has been created
    console.log(err);
    return false;
  }
};


module.exports = {
  createUserMutation,
  deleteAllUsersMutation,
  createFollowerMutation
};
