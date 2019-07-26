//==============================================================================
// __   ____ _| (_) __| | __ _| |_(_) ___  _ __
// \ \ / / _` | | |/ _` |/ _` | __| |/ _ \| '_ \
//  \ V / (_| | | | (_| | (_| | |_| | (_) | | | |
//   \_/ \__,_|_|_|\__,_|\__,_|\__|_|\___/|_| |_|
//==============================================================================

/*
Title: Level validation
Auth: aep2195
Vers: 1.0
date: 7/22/19 *Last ModBODY
desc: Validates the Level input
*/

//==============================================================================
// Head
//==============================================================================

const Validator = require("validator");
const isEmpty = require("./is-empty");

//==============================================================================
// BODY
//==============================================================================

module.exports = function validateLevelInput(data) {
  let errors = {};

  // Set the inputs to empty string if empty
  data.accessTo = !isEmpty(data.accessTo) ? data.accessTo : "";
  data.name = !isEmpty(data.name) ? data.name : "";


  if ((data.accessTo).length==0){
    errors.accessTo = "accessTo is required"
  }
  //loops through the accessTo array to make sure all inputs are alphanumeric
  if ( (data.accessTo).length!=0 ){
    for (var index in data.accessTo){
      if(!Validator.isAlphanumeric(Validator.blacklist(data.accessTo[index]," "))){
        errors.accessTo = "Invalid character inserted";
      }
      if (!Validator.isLength(data.accessTo[index], { max: 100 })) {
        errors.accessTo = "length must less than 100 characters for each function";
      }
    }
  }

  if (Validator.isEmpty(data.name)){
    errors.name = "level name is required"
  }
  if ( (!Validator.isEmpty(data.name)) && (!Validator.isAlphanumeric(Validator.blacklist(data.name," "))) ){
    errors.name = "Invalid character inserted"
  }
  if (!Validator.isLength(data.name, { max: 20 })) {
    errors.name = "length must less than 20 characters";
  }

  return {
    msg: errors,
    isValid: isEmpty(errors)
  };
};
