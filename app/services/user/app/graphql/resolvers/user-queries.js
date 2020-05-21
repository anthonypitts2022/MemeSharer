//==============================================================================
//   __ _ _   _  ___ _ __ _   _
//  / _` | | | |/ _ \ '__| | | |
// | (_| | |_| |  __/ |  | |_| |
//  \__, |\__,_|\___|_|   \__, |
//     |_|                |___/
//
//==============================================================================
/*
!Title : user-queries
!Auth  : Anthony Pitts
!Vers  : 1.0
!Date  : 11/21/19 *Last Mod
!Desc  : Conatins all the queries for users
*/

//==============================================================================
// Head
//==============================================================================
//---------------------------------
// Modules
//---------------------------------
require("module-alias/register");
const { logger } = require("@lib/logger");
const validateID = require("../../validation/validateID.js");
const { handleErrors } = require("@lib/handle-errors.js");
const { AuthenticateToken } = require('../../../lib/AuthenticateToken')



//---------------------------------
// Models
//---------------------------------

const User = require("../../models/User-model.js");
//==============================================================================
// Body
//==============================================================================

// @access : Private(Root, Admin, Staff)
// @desc   : Get a user
const userQuery = async (root, { id }) => {
  try {

    // Validate the input and return errors if any
    const { msg, isValid } = validateID(id);
    if (!isValid) throw handleErrors("001", JSON.stringify(msg))

    const user = await User.findOne({ id: id });
    return user;

  } catch (err) {
    //logger.error(`${err}`);
  }
};

// @access : Private(Root)
// @desc   : Existing users
const usersQuery = async (_, __, { req }) => {
  try {

    //Get the signed-in user's decrypted auth token payload
    const authTokenData = new AuthenticateToken(req);

    //'invalid user auth token or not signed in'
    if(authTokenData.errors) return handleErrors("001", authTokenData.errors)

    //if signed in user doesn't have access to this query
    if(!authTokenData.hasPermission(`users`)) {
      throw handleErrors("001", 'Signed in user does not have access to this query')
    }

    const users = await User.find()
    .skip(0)
    .limit(200);

    return users;

  } catch (e) {
    //logger.error(`${e}`);
  }
};


module.exports = {
  userQuery,
  usersQuery,
};
