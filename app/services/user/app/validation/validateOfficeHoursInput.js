//==============================================================================
// __   ____ _| (_) __| | __ _| |_(_) ___  _ __
// \ \ / / _` | | |/ _` |/ _` | __| |/ _ \| '_ \
//  \ V / (_| | | | (_| | (_| | |_| | (_) | | | |
//   \_/ \__,_|_|_|\__,_|\__,_|\__|_|\___/|_| |_|
//==============================================================================

/*
Title: Validate office hours
Auth: mambanerd
Vers: 1.0
date: 6/24/19 *Last ModBODY
desc: Validates the user's office hours input
*/

//==============================================================================
// Head
//==============================================================================

const Validator = require("validator");
const isEmpty = require("./is-empty");

//==============================================================================
// BODY
//==============================================================================

module.exports = function validateOfficeHoursInput(data) {
  let errors = {};

  // Set the inputs to empty string if empty
  data.uni = !isEmpty(data.uni) ? data.uni : "";

  // Check if the uni field is empty
  if (Validator.isEmpty(data.uni)) {
    errors.uni = "Uni field is required";
  }

  return {
    msg: errors,
    isValid: isEmpty(errors)
  };
};
