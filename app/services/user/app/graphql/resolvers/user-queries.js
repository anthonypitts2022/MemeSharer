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
!Auth  : aep2195
!Vers  : 1.0
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
const userQuery = async (root, { email }) => {

  const user = await User.findOne({ email: email });
  try {
    return user;
  } catch (e) {
    logger.error(`${e}`);
  }
};


const getAllUsersQuery = async (root, { args }) => {
  const users = await User.find()
    .skip(0)
    .limit(200);

  try {
    return users;
  } catch (e) {
    logger.error(e.message);
  }
};

module.exports = { userQuery, getAllUsersQuery };
