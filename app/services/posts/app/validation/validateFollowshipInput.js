//==============================================================================
// __   ____ _| (_) __| | __ _| |_(_) ___  _ __
// \ \ / / _` | | |/ _` |/ _` | __| |/ _ \| '_ \
//  \ V / (_| | | | (_| | (_| | |_| | (_) | | | |
//   \_/ \__,_|_|_|\__,_|\__,_|\__|_|\___/|_| |_|
//==============================================================================

/*
Title: validate Followship Input
Auth:
Vers: 1.0
date:
desc: validates the create Followship Input
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

module.exports = function validateFollowshipInput(data) {
  let errors = {};

  // Set default field values
  data.followerId = !isEmpty(data.followerId)
    ? data.followerId
    : '';

  // Check if followerId is empty
  if (Validator.isEmpty(data.followerId)) {
    errors.followerId = 'followerId is required';
  }

  // Limit the amount of characters
  if (!Validator.isLength(data.followerId, { max: 40 })) {
    errors.followerId = 'Maximum allowed characters is  40';
  }

  // Set default field values
  data.followeeId = !isEmpty(data.followeeId)
    ? data.followeeId
    : '';

  // Check if followeeId is empty
  if (Validator.isEmpty(data.followeeId)) {
    errors.followeeId = 'followeeId is required';
  }

  // Limit the amount of characters
  if (!Validator.isLength(data.followeeId, { max: 40 })) {
    errors.followeeId = 'Maximum allowed characters is  40';
  }


  // log the errors to console
  if (Object.keys(errors).length != 0) {
    logger.error(`${validateFollowshipInput}: inputErrors: ${JSON.stringify(errors)}`);
  }

  return {
    msg: errors,
    isValid: isEmpty(errors)
  };
};
