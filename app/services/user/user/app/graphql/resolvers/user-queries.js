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

const Users = require("../../models/User-model.js");
//==============================================================================
// Body
//==============================================================================

// @access : Private(Root, Admin, Staff)
// @desc   : Existing users
const userQuery = async (root, { uni }) => {
  // TODO: Add perms
  const user = await Users.findOne({ uni: uni });
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
  const users = await Users.find()
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
const googleLoginQuery = async (root, { googleEmail }, { res }) => {
  let user = await Users.findOne({ email: googleEmail });
  let userDepts = await UserDepts.find({ username: user.username }).select(
    "departmentName -_id"
  );
  try {
    if (!user) throw "this user doesnt exist ";
    const payload = {
      id: user.id,
      userRole: user.userRole,
      userDepts: userDepts ? userDepts : ""
    };
    // Create JWT Payload
    // Sign and creates the token. The strategy will then use this
    // as our login

    // Create a global expire token
    const tokenExp = 1000 * 60 * 60 * 1;
    const token = {
      jwtToken:
        "Bearer " +
        jwt.sign(payload, config.jwtSecretKey, {
          expiresIn: tokenExp
        })
    };

    // Send the jwt token to the client as a cookie
    res.cookie("Auth", token, {
      secret: "mamb123werwerwer",
      maxAge: tokenExp,
      httpOnly: true
    });

    const loggedInUser = {
      id: user.id,
      userRole: user.userRole,
      departments: userDepts ? userDepts : "",
      loginExp: tokenExp
    };
    return loggedInUser;
  } catch (e) {
    console.log(e);
  }
};
module.exports = {
  userQuery,
  usersQuery,
  googleLoginQuery
};
