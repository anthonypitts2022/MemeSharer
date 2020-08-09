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
!Desc  : Conatins all the queries for Auth Microservice
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
const { AuthenticateToken } = require('../../../lib/tokenAuth/accessToken/AuthenticateAccessToken')



//---------------------------------
// Models
//---------------------------------

const RefreshToken = require("../../models/RefreshToken-model.js");
//==============================================================================
// Body
//==============================================================================





module.exports = {
  userQuery,
};
