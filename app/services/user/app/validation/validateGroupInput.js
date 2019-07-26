//==============================================================================
// __   ____ _| (_) __| | __ _| |_(_) ___  _ __
// \ \ / / _` | | |/ _` |/ _` | __| |/ _ \| '_ \
//  \ V / (_| | | | (_| | (_| | |_| | (_) | | | |
//   \_/ \__,_|_|_|\__,_|\__,_|\__|_|\___/|_| |_|
//==============================================================================

/*
Title: Validate group input;
Auth: mambanerd
Vers: 1.0
date: 6/24/19 *Last ModBODY
desc: Validates the group input
*/

//==============================================================================
// Head
//==============================================================================

const Validator = require("validator");
const isEmpty = require("./is-empty");

//==============================================================================
// BODY
//==============================================================================

module.exports = function validateGroupInput(data) {
  let errors = {};

  // Set the inputs to empty string if empty
  data.groupName = !isEmpty(data.groupName) ? data.groupName : "";
  data.groupEmail = !isEmpty(data.groupEmail) ? data.groupEmail : "";

  // groupName validation
  if (Validator.isEmpty(data.groupName)) {
    errors.groupName = "Group name field is required";
  }
  if (!Validator.isAlphanumeric(data.groupName)) {
    errors.groupName = "Invalid character inserted";
  }

  // groupEmail validation
  if (Validator.isEmpty(data.groupEmail)) {
    errors.groupEmail = "Group Email field is required";
  }
  if (!Validator.isEmail(data.groupEmail)) {
    errors.groupEmail = "Email is invalid";
  }

  return {
    msg: errors,
    isValid: isEmpty(errors)
  };
};
