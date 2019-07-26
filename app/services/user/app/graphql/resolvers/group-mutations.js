//==============================================================================
//                  _        _   _
//  _ __ ___  _   _| |_ __ _| |_(_) ___  _ __
// | '_ ` _ \| | | | __/ _` | __| |/ _ \| '_ \
// | | | | | | |_| | || (_| | |_| | (_) | | | |
// |_| |_| |_|\__,_|\__\__,_|\__|_|\___/|_| |_|
//
//==============================================================================
/*
!Title : userGroup-Mutation
!Auth  : ya2369
!Vers  : 1.0
!Date  : 6/24;/19 *Last Mod
!Desc  : Contains All mutations for users group
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
const config = require("../../../config/config.js");

//---------------------------------
// Models
//---------------------------------
const Groups = require("../../models/Group-model.js");
const UserGroups = require("../../models/UserGroup-model.js");

//---------------------------------
// Validation
//---------------------------------
const validateGroupInput = require("../../validation/validateGroupInput.js");
const validateUserGroupInput = require("../../validation/validateUserGroupInput.js");

//==============================================================================
// BODY
//==============================================================================
// @access : Root
// @desc   : Create a single user group
const createGroupMutation = async (parent, { input }) => {
  // TODO: add perms

  // Validate the user input and return errors if any
  const { msg, isValid } = validateGroupInput(input);
  if (!isValid) {
    return handleErrors("001", msg);
  }

  // Initiate the models by finding if the fields below exist
  // TODO: Make the below comapitble with case insensitive
  let group = await Groups.findOne({ groupName: input.groupName });

  try {
    // Throw errors if the conditions are met
    if (group) throw "User group already exists!";

    // Create a user object based on the input
    const newGroup = new Groups({
      groupName: input.groupName,
      groupEmail: input.groupEmail
    });

    return newGroup.save();
  } catch (e) {
    logger.error(`${e}`);
    // Database response after user has been created
    if (group) {
      return handleErrors("001", { groupName: "User group already exists!" });
    }
  }
};

// @access : Root
// @desc   : Add a user to group
const addUserGroupMutation = async (root, { input }) => {
  // TODO: Add perms

  // Validate the user input and return errors if any
  const { msg, isValid } = validateUserGroupInput(input);
  if (!isValid) {
    return handleErrors("001", msg);
  }

  // Initiate the models by finding if the fields below exist
  // TODO: Make the below comapitble with case insensitive
  let userGroup = await UserGroups.findOne({ uni: input.uni });
  let group = await Groups.findById(input.groupID);
  // TODO: Search if the user you are adding exists
  try {
    if (userGroup) {
      throw "User is already in the group!";
    }
    if (!group) {
      throw "This group doesn't exist!";
    }

    // Create a user object based on the input
    const newUserGroup = new UserGroups({
      groupID: input.groupID,
      uni: input.uni
    });

    return newUserGroup.save();
  } catch (e) {
    logger.error(`${e}`);
    // Database response after user has been created
    if (userGroup) {
      return handleErrors("001", { uni: "User is already in the group!" });
    }
    if (!group) {
      return handleErrors("001", { groupID: "This group doesn't exist!" });
    }
  }
};

//==============================================================================
// EXPORTS
//==============================================================================
module.exports = { createGroupMutation, addUserGroupMutation };
