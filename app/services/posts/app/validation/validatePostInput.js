//==============================================================================
// __   ____ _| (_) __| | __ _| |_(_) ___  _ __
// \ \ / / _` | | |/ _` |/ _` | __| |/ _ \| '_ \
//  \ V / (_| | | | (_| | (_| | |_| | (_) | | | |
//   \_/ \__,_|_|_|\__,_|\__,_|\__|_|\___/|_| |_|
//==============================================================================

/*
Title: Post validation
Auth: Anthony Pitts
Vers: 1.0
date: 8/7/19 *Last ModBODY
desc: Validates the Post Input


*/

//==============================================================================
// Head
//==============================================================================

const Validator = require("validator");
const isEmpty = require("./is-empty");

//==============================================================================
// BODY
//==============================================================================

module.exports = function validatePostInput(data) {
  let errors = {};

  // Set the inputs to empty string if empty
  data.caption = !isEmpty(data.caption) ? data.caption : "";
  data.fileId = !isEmpty(data.fileId) ? data.fileId : "";
  data.fileType = !isEmpty(data.fileType) ? data.fileType : "";


  if (!Validator.isLength(data.caption, { max: 10000 })) {
    errors.caption = "Caption length must less than 10,000 characters";
  }
  if (Validator.isEmpty(data.fileId)){
    errors.fileId = "fileId is required"
  }
  if (Validator.isEmpty(data.fileType)){
    errors.fileType = "fileType is required"
  }


  return {
    msg: errors,
    isValid: isEmpty(errors)
  };
};
