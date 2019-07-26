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
!Auth  : mambanerd
!Vers  : 1.0
!Date  : 6/20/19 *Last Mod
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
const { handleErrors } = require("@lib/handle-errors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../../../config/config.js");

// const { logger } = reqlib("/config/logger.js");

//---------------------------------
// Models
//---------------------------------

const User = require("../../models/User-model.js");

//==============================================================================
// Body
//==============================================================================

// @access : Private(Root, Admin, Staff)
// @desc   : Existing users
const userQuery = async (root, { uni }) => {
  // TODO: Add perms
  const user = await User.findOne({ uni: uni });
  try {
    return user;
  } catch (e) {
    logger.error(`${e}`);
  }
};

// @access : Private(Root)
// @desc   : Existing users
const usersQuery = async (root, { args }) => {
  // TODO: Add perms
  const users = await User.find()
    .skip(0)
    .limit(200);
  try {
    return users;
  } catch (e) {
    logger.error(`${e}`);
  }
};

// @access : Public(uses)
// @desc   : Login using google login
const googleLoginQuery = async (root, { code }) => {
  console.log(code);
};
module.exports = { userQuery, usersQuery };
