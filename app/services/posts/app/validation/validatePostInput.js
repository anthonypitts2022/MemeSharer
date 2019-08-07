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
  data.userId = !isEmpty(data.userId) ? data.userId : "";
  data.caption = !isEmpty(data.caption) ? data.caption : "";

  if (Validator.isEmpty(data.userId)){
    errors.userId = "userId is required"
  }

  if (!Validator.isLength(data.userId, { max: 20 })) {
    errors.userId = "length must less than 20 characters";
  }

  if (!Validator.isLength(data.caption, { max: 10000 })) {
    errors.caption = "Caption length must less than 10,000 characters";
  }

  return {
    msg: errors,
    isValid: isEmpty(errors)
  };
};
