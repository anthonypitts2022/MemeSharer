//==============================================================================
// __   ____ _| (_) __| | __ _| |_(_) ___  _ __
// \ \ / / _` | | |/ _` |/ _` | __| |/ _ \| '_ \
//  \ V / (_| | | | (_| | (_| | |_| | (_) | | | |
//   \_/ \__,_|_|_|\__,_|\__,_|\__|_|\___/|_| |_|
//==============================================================================

/*
Title: follower creation Validation
Auth: Anthony Pitts
Vers: 1.0
date: 8/10/19 *Last ModBODY
desc: Validates the follower input
*/

//==============================================================================
// Head
//==============================================================================

const Validator = require("validator");
const isEmpty = require("./is-empty");

//==============================================================================
// BODY
//==============================================================================

module.exports = function validateFollowerInput(data) {
  let errors = {};

  // Set the inputs to empty string if empty
  data.userFollowingId = !isEmpty(data.userFollowingId) ? data.userFollowingId : "";
  data.userBeingFollowedId = !isEmpty(data.userBeingFollowedId) ? data.userBeingFollowedId : "";

  // Check for empty fields
  if (Validator.isEmpty(data.userBeingFollowedId)) {
    errors.userBeingFollowedId = "userBeingFollowedId field is required";
  }

  //length checks
  if (!Validator.isLength(data.userBeingFollowedId, { min: 1, max: 300 })) {
    errors.userBeingFollowedId = "userBeingFollowedId length must be between 5 and 300 characters";
  }


  return {
    msg: errors,
    isValid: isEmpty(errors)
  };
};
