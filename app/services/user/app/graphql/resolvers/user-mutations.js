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

//---------------------------------
// Validation
//---------------------------------
const validateUserInput = require("../../validation/validateUserInput.js");

//==============================================================================
// BODY
//==============================================================================

// @access : Root
// @desc   : Create a single user
const createUserMutation = async (parent, { input }) => {
  // TODO: Add perms
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
  } catch (err) {
    logger.info(`${err}`);
    // Database response after user has been created
    if (user) {
      return handleErrors("001", { email: "User already exists!" });
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


module.exports = { createUserMutation, deleteAllUsersMutation };
