//==============================================================================
// __   ____ _| (_) __| | __ _| |_(_) ___  _ __
// \ \ / / _` | | |/ _` |/ _` | __| |/ _ \| '_ \
//  \ V / (_| | | | (_| | (_| | |_| | (_) | | | |
//   \_/ \__,_|_|_|\__,_|\__,_|\__|_|\___/|_| |_|
//==============================================================================

/*
Title: User Perms validation
Auth: aep2195
Vers: 1.0
date: 7/22/19 *Last ModBODY
desc: Validates the User Perms Input

//user perms is NOT a model  - it is a construct to make comprehension of what is
//   happening in the backend easier to understand in the front end
*/

//==============================================================================
// Head
//==============================================================================

const Validator = require("validator");
const isEmpty = require("./is-empty");

//==============================================================================
// BODY
//==============================================================================

module.exports = function validateUserPermsInput(data) {
  let errors = {};

  // Set the inputs to empty string if empty
  data.uni = !isEmpty(data.uni) ? data.uni : "";
  data.levelId = !isEmpty(data.levelId) ? data.levelId : "";

  if (Validator.isEmpty(data.uni)){
    errors.uni = "uni is required"
  }
  if ( (!Validator.isEmpty(data.uni)) && (!Validator.isAlphanumeric(Validator.blacklist(data.uni," "))) ){
    errors.uni = "Invalid character inserted"
  }
  if (!Validator.isLength(data.uni, { max: 20 })) {
    errors.uni = "length must less than 20 characters";
  }

  if (Validator.isEmpty(data.levelId)){
    errors.levelId = "levelId is required"
  }
  if ( (!Validator.isEmpty(data.levelId)) && (!Validator.isAlphanumeric(Validator.blacklist(data.levelId," "))) ){
    errors.levelId = "Invalid character inserted"
  }
  if (!Validator.isLength(data.levelId, { max: 20 })) {
    errors.levelId = "length must less than 20 characters";
  }

  return {
    msg: errors,
    isValid: isEmpty(errors)
  };
};
