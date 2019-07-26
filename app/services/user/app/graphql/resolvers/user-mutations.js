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
!Auth  : ya2369
!Vers  : 1.0
!Date  : 6/24;/19 *Last Mod
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
const Users = require("../../models/User-model.js");

//---------------------------------
// Validation
//---------------------------------
const validateUserInput = require("../../validation/validateUserInput.js");
const validateOfficeHoursInput = require("../../validation/validateOfficeHoursInput.js");

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
  let user = await Users.find({
    $or: [{ email: input.email }, { uni: input.uni }]
  });

  try {
    // Throw errors if the conditions are met
    if (user) throw "User already exists!";

    // Create a user object based on the input
    const newUser = new Users({
      uni: input.uni,
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      phoneNumber: input.phoneNumber,
      address: input.address,
      address2: input.address2,
      userType: input.userType,
      department: input.department,
      // If no password was inserted, then create a password
      password: input.password ? input.password : generatePassword(8),
      password2: input.password2 ? input.password2 : this.password
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

    // Notify new user email creation if notify user is enables
    // create the send email functionality
    const notifyUser = input.notifyUser ? input.notifyUser : true;
    if (notifyUser) {
      const sendEmail = async emailVars => {
        let send = await axios.post(
          config.emailHost + "/user/account-creation",
          emailVars
        );
      };
      // Set the variabales being sent to the email service
      const emailInfo = { firstName: newUser.firstName, email: newUser.email };
      // Send the email along with the vars
      sendEmail(emailInfo);
    }
    // TODO: Log  user creation and the current logged in user that created the user

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

// @access : Root,admin,user
// @desc   : Create/modify user office hours
const editOfficeHoursMutation = async (root, { uni }) => {
  // TODO: Add perms
  // Validate the user input and return errors if any
  const { msg, isValid } = validateOfficeHoursInput(input);
  if (!isValid) {
    return handleErrors("001", msg);
  }
};

module.exports = { createUserMutation, editOfficeHoursMutation };
