//==============================================================================
// __   ____ _| (_) __| | __ _| |_(_) ___  _ __
// \ \ / / _` | | |/ _` |/ _` | __| |/ _ \| '_ \
//  \ V / (_| | | | (_| | (_| | |_| | (_) | | | |
//   \_/ \__,_|_|_|\__,_|\__,_|\__|_|\___/|_| |_|
//==============================================================================

/*
Title: Like validation
Auth: Anthony Pitts
Vers: 1.0
date: 8/7/19 *Last ModBODY
desc: Validates the caption Input
*/


//==============================================================================
// Head
//==============================================================================

const Validator = require("validator");
const isEmpty = require("./is-empty");

//==============================================================================
// BODY
//==============================================================================

module.exports = function validateLikeInput(caption) {
  let errors = {};

  // Set the inputs to empty string if empty
  caption = !isEmpty(caption) ? caption : "";

  //required checks
  if (Validator.isEmpty(caption)){
    errors["caption"] = "new Caption is required";
  }

  if (!Validator.isLength(caption, { max: 10000 })) {
    errors["caption"] = "length must less than 10,000 characters";
  }


  return {
    msg: errors,
    isValid: isEmpty(errors)
  };
};
