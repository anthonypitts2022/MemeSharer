//==============================================================================
// __   ____ _| (_) __| | __ _| |_(_) ___  _ __
// \ \ / / _` | | |/ _` |/ _` | __| |/ _ \| '_ \
//  \ V / (_| | | | (_| | (_| | |_| | (_) | | | |
//   \_/ \__,_|_|_|\__,_|\__,_|\__|_|\___/|_| |_|
//==============================================================================

/*
Title:Company query
Auth: mambanerd
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
  data.uni = !isEmpty(data.uni) ? data.uni : "";
  data.firstName = !isEmpty(data.firstName) ? data.firstName : "";
  data.lastName = !isEmpty(data.lastName) ? data.lastName : "";
  data.phoneNumber = !isEmpty(data.phoneNumber) ? data.phoneNumber : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.userType = !isEmpty(data.userType) ? data.userType : "";
  data.department = !isEmpty(data.department) ? data.department : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";

  // Check if the uni field is empty
  if (Validator.isEmpty(data.uni)) {
    errors.uni = "Uni field is required";
  }

  // firstName validation
  if (Validator.isEmpty(data.firstName)) {
    errors.firstName = "First Name field is required";
  }
  if (!Validator.isAlpha(data.firstName)) {
    errors.firstName = "Invalid characters inserted";
  }

  // lastName validation
  if (Validator.isEmpty(data.lastName)) {
    errors.lastName = "Last Name field is required";
  }
  if (!Validator.isAlpha(data.lastName)) {
    errors.lastName = "Invalid characters inserted";
  }
  // email validation
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  }
  if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }

  // Phone number validation
  if (Validator.isEmpty(data.phoneNumber)) {
    errors.phoneNumber = "Phone number field is required";
  }
  if (!Validator.isNumeric(data.phoneNumber)) {
    errors.phoneNumber = "Phone number is invalid";
  }

  // Address validation
  if (!Validator.isNumeric(data.address) || !Validator.isAlpha(data.address)) {
    errors.address = "Address contains invalid characters";
  }

  // Address2 validation
  if (
    !Validator.isNumeric(data.address2) ||
    !Validator.isAlpha(data.address2)
  ) {
    errors.email = "Room/Suite contains invalid characters";
  }

  // userType validation
  if (Validator.isEmpty(data.userType)) {
    errors.userType = "User Type is required";
  }
  if (!Validator.isAlpha(data.userType)) {
    errors.userType = "Invalid characters inserted";
  }

  // department validation
  if (Validator.isEmpty(data.department)) {
    errors.department = "Departments is required";
  }
  if (!Validator.isAlpha(data.department)) {
    errors.department = "Invalid characters inserted";
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
