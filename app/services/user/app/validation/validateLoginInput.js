//==============================================================================
// __   ____ _| (_) __| | __ _| |_(_) ___  _ __
// \ \ / / _` | | |/ _` |/ _` | __| |/ _ \| '_ \
//  \ V / (_| | | | (_| | (_| | |_| | (_) | | | |
//   \_/ \__,_|_|_|\__,_|\__,_|\__|_|\___/|_| |_|
//==============================================================================

/*
Title: Login Validation
Auth: Anthony Pitts
Vers: 1.0
date: 8/10/19 *Last ModBODY
desc: Validates the user login input
*/

//==============================================================================
// Head
//==============================================================================

const Validator = require("validator");
const isEmpty = require("./is-empty");

//==============================================================================
// BODY
//==============================================================================

module.exports = function validateLoginInput(data) {
  let errors = {};

  // Set the inputs to empty string if empty
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  // Check if the name field is empty
  if (Validator.isEmpty(data.email)) {
    errors.email = "email field is required";
  }
  // Check if the email field is empty
  if (Validator.isEmpty(data.password)) {
    errors.password = "password field is required";
  }

  // email validation
  if (!data.email.includes("@")) {
    errors.email = "Invalid email format";
  }

  return {
    msg: errors,
    isValid: isEmpty(errors)
  };
};
