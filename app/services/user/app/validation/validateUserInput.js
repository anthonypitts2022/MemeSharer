//==============================================================================
// __   ____ _| (_) __| | __ _| |_(_) ___  _ __
// \ \ / / _` | | |/ _` |/ _` | __| |/ _ \| '_ \
//  \ V / (_| | | | (_| | (_| | |_| | (_) | | | |
//   \_/ \__,_|_|_|\__,_|\__,_|\__|_|\___/|_| |_|
//==============================================================================

/*
Title:Company query
Auth: Anthony Pitts
Vers: 1.0
date: 4/6/19 *Last ModBODY
desc: Validates the user input
*/

//==============================================================================
// Head
//==============================================================================

const Validator = require("validator");
const isEmpty = require("./is-empty");

//==============================================================================
// BODY
//==============================================================================

module.exports = function validateUserInput(data) {
  let errors = {};

  // Set the inputs to empty string if empty
  data.name = !isEmpty(data.name) ? data.name : "";
  data.email = !isEmpty(data.email) ? data.email : "";

  // Check if the name field is empty
  if (Validator.isEmpty(data.name)) {
    errors.name = "name field is required";
  }
  // Check if the email field is empty
  if (Validator.isEmpty(data.email)) {
    errors.email = "email field is required";
  }

  // email validation
  if (Validator.isEmail(data.email)) {
    errors.email = "Invalid email format";
  }

  //length checks
  if (!Validator.isLength(data.email, { min: 6, max: 30 })) {
    errors.email = "email length must be between 6 and 30 characters";
  }
  if (!Validator.isLength(data.name, { min: 6, max: 30 })) {
    errors.name = "name length must be between 6 and 30 characters";
  }

  // password validation
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password is required";
  }
  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = "Password length must be between 6 and 30 characters";
  }
  if (Validator.isEmpty(data.password2)) {
    errors.password2 = "Password2 is required";
  }
  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = "passwords do not match";
  }

  return {
    msg: errors,
    isValid: isEmpty(errors)
  };
};
