//==============================================================================
// __   ____ _| (_) __| | __ _| |_(_) ___  _ __
// \ \ / / _` | | |/ _` |/ _` | __| |/ _ \| '_ \
//  \ V / (_| | | | (_| | (_| | |_| | (_) | | | |
//   \_/ \__,_|_|_|\__,_|\__,_|\__|_|\___/|_| |_|
//==============================================================================

/*
Title: validate delete Student Input
Auth:
Vers: 1.0
date:
desc: validates the delete Student Input
*/

//==============================================================================
// Head
//==============================================================================
require("module-alias/register");
const { logger } = require("@lib/logger");
const Validator = require("validator");
const isEmpty = require("./is-empty");

//==============================================================================
// BODY
//==============================================================================
module.exports = function validateID(id) {
  let errors = {};

  // Set the id to empty string if empty
  id = !isEmpty(id) ? id : "";

  if(
    Validator.isEmpty(id)
  ) {
    errors.id = "ID is required."
  }


  // Check max length
  if (
    !Validator.isEmpty(id) &&
    !Validator.isLength(id, {max: 15})
  ) {
    errors.id = "ID can not be more than 15 characters.";
  }

  // log the errors to console
  if (Object.keys(errors).length != 0) {
    logger.error(`validateID: inputErrors: ${JSON.stringify(errors)}`);
  }
  return {
    msg: errors,
    isValid: isEmpty(errors)
  };
};
