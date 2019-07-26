//==============================================================================
// __   ____ _| (_) __| | __ _| |_(_) ___  _ __
// \ \ / / _` | | |/ _` |/ _` | __| |/ _ \| '_ \
//  \ V / (_| | | | (_| | (_| | |_| | (_) | | | |
//   \_/ \__,_|_|_|\__,_|\__,_|\__|_|\___/|_| |_|
//==============================================================================

/*
Title: Validate user group input;
Auth: mambanerd
Vers: 1.0
date: 6/24/19 *Last ModBODY
desc: Validates the user group input
*/

//==============================================================================
// Head
//==============================================================================

const Validator = require("validator");
const isEmpty = require("./is-empty");

//==============================================================================
// BODY
//==============================================================================

module.exports = function validateUserGroupInput(data) {
  let errors = {};

  // Set the inputs to empty string if empty
  data.groupID = !isEmpty(data.groupID) ? data.groupID : "";
  data.uni = !isEmpty(data.uni) ? data.uni : "";

  // Check if the groupID field is empty
  if (Validator.isEmpty(data.groupID)) {
    errors.groupID = "The group ID is missing";
  }

  // Check if the Uni field is empty
  if (Validator.isEmpty(data.uni)) {
    errors.uni = "Uni field is required";
  }
  if (!Validator.isAlphanumeric(data.uni)) {
    errors.uni = "Invalid characters inserted";
  }

  return {
    msg: errors,
    isValid: isEmpty(errors)
  };
};
