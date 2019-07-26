//==============================================================================
//   __ _ _   _  ___ _ __ _   _
//  / _` | | | |/ _ \ '__| | | |
// | (_| | |_| |  __/ |  | |_| |
//  \__, |\__,_|\___|_|   \__, |
//     |_|                |___/
//
//==============================================================================
/*
!Title : userGroups-queries
!Auth  : ya2369
!Vers  : 1.0
!Date  : 6/24/19 *Last Mod
!Desc  : Conatins all the queries for groups
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
const config = require("../../../config/config.js");

//---------------------------------
// Models
//---------------------------------

const Groups = require("../../models/Group-model.js");
const UserGroups = require("../../models/UserGroup-model.js");

//==============================================================================
// Body
//==============================================================================

// @access : Private(Root, Admin)
// @desc   : Existing users
const groupsQuery = async (root, { args }) => {
  // TODO: add perms
  const groups = await Groups.find();
  try {
    return groups;
  } catch (e) {
    logger.error(`${e}`);
  }
};

// @access : Private(Root, Admin)
// @desc   : Get all groups a user belongs to
const userGroupsQuery = async (root, { uni }) => {
  console.log(uni);
  // TODO: add perms
  const userGroups = await UserGroups.find({ uni: uni });
  try {
    return userGroups;
  } catch (e) {
    logger.error(`${e}`);
  }
};

module.exports = { groupsQuery, userGroupsQuery };
