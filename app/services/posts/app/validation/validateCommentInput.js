//==============================================================================
// __   ____ _| (_) __| | __ _| |_(_) ___  _ __
// \ \ / / _` | | |/ _` |/ _` | __| |/ _ \| '_ \
//  \ V / (_| | | | (_| | (_| | |_| | (_) | | | |
//   \_/ \__,_|_|_|\__,_|\__,_|\__|_|\___/|_| |_|
//==============================================================================

/*
Title: Comment validation
Auth: Anthony Pitts
Vers: 1.0
date: 8/7/19 *Last ModBODY
desc: Validates the Comment Input
*/


//==============================================================================
// Head
//==============================================================================

const Validator = require("validator");
const isEmpty = require("./is-empty");

//==============================================================================
// BODY
//==============================================================================

module.exports = function validateCommentInput(data) {
  let errors = {};

  // Set the inputs to empty string if empty
  data.postId = !isEmpty(data.postId) ? data.postId : "";
  data.text = !isEmpty(data.text) ? data.text : "";

  //required checks
  if (Validator.isEmpty(data.postId)){
    errors.postId = "postId is required"
  }
  if (Validator.isEmpty(data.text)){
    errors.text = "text is required"
  }


  if (!Validator.isLength(data.postId, { max: 20 })) {
    errors.postId = "length must less than 20 characters";
  }
  if (!Validator.isLength(data.text, { max: 500 })) {
    errors.text = "length must less than 500 characters";
  }


  return {
    msg: errors,
    isValid: isEmpty(errors)
  };
};
