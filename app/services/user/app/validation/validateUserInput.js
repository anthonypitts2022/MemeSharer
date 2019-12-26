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

const Validator = require('validator')
const isEmpty = require('./is-empty')

//==============================================================================
// BODY
//==============================================================================

module.exports = function validateUserInput(data) {
  let errors = {}

  // Set the inputs to empty string if empty
  data.name = !isEmpty(data.name) ? data.name : ''
  data.email = !isEmpty(data.email) ? data.email : ''
  data.id = !isEmpty(data.id) ? data.id : ''
  data.profileUrl = !isEmpty(data.profileUrl) ? data.profileUrl : ''


  // Check for empty fields
  if (Validator.isEmpty(data.name)) {
    errors.name = 'name field is required'
  }
  if (Validator.isEmpty(data.email)) {
    errors.email = 'email field is required'
  }
  if (Validator.isEmpty(data.id)) {
    errors.id = 'id field is required'
  }
  if (Validator.isEmpty(data.profileUrl)) {
    errors.profileUrl = 'profileUrl field is required'
  }

  //alphanumeric validation
  if (!Validator.isAlpha(data.name.replace(" ",""))) {
    errors.name = 'Invalid characters inserted'
  }


  // email validation
  if (!Validator.isEmail(data.email)) {
    errors.email = 'Email is invalid'
  }


  return {
    msg: errors,
    isValid: isEmpty(errors)
  }
}
