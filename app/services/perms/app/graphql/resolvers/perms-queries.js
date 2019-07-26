//==============================================================================
//   __ _ _   _  ___ _ __ _   _
//  / _` | | | |/ _ \ '__| | | |
// | (_| | |_| |  __/ |  | |_| |
//  \__, |\__,_|\___|_|   \__, |
//     |_|                |___/
//
//==============================================================================
/*
!Title : perms-queries
!Auth  : aep2195
!Vers  : 1.0
!Date  : 7/13/19 *Last Mod
!Desc  : Conatins all the queries for perms service
*/

//==============================================================================
// Head
//==============================================================================
//---------------------------------
// Modules
//---------------------------------
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { handleErrors } = require("../../utils/handle-errors.js");
const config = require("../../../config/config.js");
const { logger } = require("app-root-path").require("/config/logger.js");
// const { logger } = reqlib("/config/logger.js");

//---------------------------------
// Models
//---------------------------------

const Level = require("../../models/Level-model.js");
const LevelAccess = require("../../models/LevelAccess-model.js");
const AccessTo = require("../../models/AccessTo-model.js");


//==============================================================================
// Body
//==============================================================================


// @access : Private(Root, Admin)
// @desc   : Get a Level with id
const getLevelQuery = async (root, {id}) => {
  const level = await Level.findById(id);

  try{
    return level
  } catch (e) {
    logger.error('${e}');
  }
};


// @access : public
// @desc   : find out if user has access to functionality
const haveAuthQuery = async (root, {input} ) => {
  try{
    //check if uni is in the system
    const uniCheck = await AccessTo.findOne({ uni: input.uni });
    if (!uniCheck) {
      console.log("User Permissions doesn't exist!");
      throw "User Permissions doesn't exists!";
    }

    //get accessTo object with uni and functionality
    const accessTo = await AccessTo.findOne({ uni: input.uni, functionality: input.functionality });
    if (!accessTo) {
      return false;
    }
    else{
      return true;
    }
  }catch (e) {
    logger.error('${e}');
  }
};


// @access : Private(Root, Admin)
// @desc   : which uni(s) have access to a functionality
const whoHasAccessQuery = async (root, {functionality}, {user} ) => {
  //get acccessTo objects that have a certain functionality
  const accessTo = await AccessTo.find({ functionality: functionality });

  //get unis that those accessTo objects contains
  var uniList = [];
  for (var index in accessTo){
    uniList.push(accessTo[index].uni);
  }

  try{
    return uniList;
  } catch (e) {
    logger.error('${e}');
  }
};

// @access : Public
// @desc   : all functionality a uni has access to
const uniAccessQuery = async (root, {uni} ) => {
  //get acccessTo objects that have a certain uni
  const accessToObjs = await AccessTo.find({ uni: uni });

  //get functionality that those accessTo objects contains
  var functionalityList = [];
  for (var index in accessToObjs){
    functionalityList.push(accessToObjs[index].functionality);
  }

  try{
    return functionalityList;
  } catch (e) {
    logger.error('${e}');
  }
};


module.exports = {
  getLevelQuery,
  haveAuthQuery,
  whoHasAccessQuery,
  uniAccessQuery
};
