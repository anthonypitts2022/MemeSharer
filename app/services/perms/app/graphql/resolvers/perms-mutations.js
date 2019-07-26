//==============================================================================
//                  _        _   _
//  _ __ ___  _   _| |_ __ _| |_(_) ___  _ __
// | '_ ` _ \| | | | __/ _` | __| |/ _ \| '_ \
// | | | | | | |_| | || (_| | |_| | (_) | | | |
// |_| |_| |_|\__,_|\__\__,_|\__|_|\___/|_| |_|
//
//==============================================================================
/*
!Title : perms-Mutation
!Auth  : aep2195
!Vers  : 1.0
!Date  : 7/13/19 *Last Mod
!Desc  : Contains All mutations for perms service
*/

//==============================================================================
// HEAD
//==============================================================================

//---------------------------------
// Modules
//---------------------------------
const { generatePassword } = require("../../utils/passGen.js");
const bcrypt = require("bcrypt");
const { handleErrors } = require("../../utils/handle-errors.js");
const isMongodbid = require("../../utils/is-mongodbid");
const config = require("../../../config/config.js");
const { logger } = require("app-root-path").require("/config/logger.js");
// const csv = require("csvtojson");
const path = require("path");
const axios = require("axios");

//---------------------------------
// Models
//---------------------------------

const Level = require("../../models/Level-model.js");
const LevelAccess = require("../../models/LevelAccess-model.js");
const AccessTo = require("../../models/AccessTo-model.js");

//---------------------------------
// Validation
//---------------------------------

const validateLevelInput = require("../../validation/validateLevelInput.js");
const validateUserPermsInput = require("../../validation/validateUserPermsInput.js");

//==============================================================================
// Body
//==============================================================================


//==============================================================================
// Create A Level Object
//==============================================================================

// @access : Root, Admin
// @desc   : Create a Level Object
const createLevelMutation = async (parent, { input }) => {

  // Validate the level input and return errors if any
  const { msg, isValid } = validateLevelInput(input);
  if (!isValid) {
    return handleErrors("001", msg);
  }

  try {
    // Create a Level object based on the input
    const newLevel = new Level({
      name: input.name
    });
    newLevel.save();

    //create AccessTo objects that correspond with this level's authorization
    for (var index in input.accessTo){
      const newLevelAccess = new LevelAccess({
        levelId: newLevel.id,
        functionality: input.accessTo[index]
      });
      newLevelAccess.save();
    }


    return newLevel;
    // Initiate sending the new level to the database
  } catch (err) {
    // Database response after level has been created
    console.log(err);
  }
};




//==============================================================================
// Create A User with Permissions
//==============================================================================

// @access : Root, Admin
// @desc   : Create a User Perms Object
//user perms is NOT a model  - it is a construct to make comprehension of what is
//   happening in the backend easier to understand in the front end
//using this on an already exisitng object will remove its prior level status
const createUserPermsMutation = async (parent, { input }) => {

  // Validate the User Perms input and return errors if any
  const { msg, isValid } = validateUserPermsInput(input);
  if (!isValid) {
    return handleErrors("001", msg);
  }

  try {

    //if uni is already in system yet
    if(await AccessTo.findOne({uni: input.uni})){
      //remove exisiting objects
      await AccessTo.deleteMany({uni: input.uni}, function (err) {
        if (err) return handleError(err);
      });
    }

    //gets all level access objs with corresponding level Id
    const levelAccesses = await LevelAccess.find({levelId: input.levelId});

    //get functionality from the levelAccess objects
    var functionalityList = [];
    for (var index in levelAccesses){
      functionalityList.push(levelAccesses[index].functionality);
    }
    //create AccessTo objects that correspond with this level's authorization
    for (var i in functionalityList){
      const newAccessTo = new AccessTo({
        levelId: input.levelId,
        functionality: functionalityList[i],
        uni: input.uni
      });
      newAccessTo.save();
    }

    return true;
    // Initiate sending the new level to the database

  } catch (err) {
      // Database response after level has been created
      console.log(err);
      return false;
  }
};

module.exports = {
  createLevelMutation,
  createUserPermsMutation
};
