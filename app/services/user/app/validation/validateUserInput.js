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
  data.username = !isEmpty(data.username) ? data.username : ''
  data.firstName = !isEmpty(data.firstName) ? data.firstName : ''
  data.lastName = !isEmpty(data.lastName) ? data.lastName : ''
  data.phoneNumber = !isEmpty(data.phoneNumber) ? data.phoneNumber : ''
  data.email = !isEmpty(data.email) ? data.email : ''
  data.userType = !isEmpty(data.userType) ? data.userType : ''
  data.userRole = !isEmpty(data.userRole) ? data.userRole : ''
  data.checkinOption = !isEmpty(data.checkinOption) ? data.checkinOption : false
  // data.department = !isEmpty(data.department) ? data.department : ''

  // Check if the username field is empty
  if (Validator.isEmpty(data.username)) {
    errors.username = 'Username field is required'
  }

  // firstName validation
  if (Validator.isEmpty(data.firstName)) {
    errors.firstName = 'First Name field is required'
  }
  if (!Validator.isAlpha(data.firstName)) {
    errors.firstName = 'Invalid characters inserted'
  }

  // lastName validation
  if (Validator.isEmpty(data.lastName)) {
    errors.lastName = 'Last Name field is required'
  }
  if (!Validator.isAlpha(data.lastName)) {
    errors.lastName = 'Invalid characters inserted'
  }
  // email validation
  if (Validator.isEmpty(data.email)) {
    errors.email = 'Email field is required'
  }
  if (!Validator.isEmail(data.email)) {
    errors.email = 'Email is invalid'
  }
  if (
    !Validator.isAlphanumeric(Validator.blacklist(data.email, '@.\\-\\_')) &&
    !Validator.isEmpty(data.email)
  ) {
    errors.email = 'Invalid character inserted'
  }

  // Phone number validation
  if (Validator.isEmpty(data.phoneNumber)) {
    errors.phoneNumber = 'Phone number field is required'
  }
  if (!Validator.isNumeric(data.phoneNumber)) {
    errors.phoneNumber = 'Phone number is invalid'
  }

  // Address validation
  if (Validator.isEmpty(data.address)) {
    errors.address = 'Address field is required'
  }

  if (
    !Validator.isAlphanumeric(Validator.blacklist(data.address, '.,\\ \\#')) &&
    !Validator.isEmpty(data.address)
  ) {
    errors.address = 'Invalid character inserted'
  }

  // Address2 validation
  if (
    !Validator.isAlphanumeric(Validator.blacklist(data.address2, '.,\\ \\#')) &&
    !Validator.isEmpty(data.address2)
  ) {
    errors.address2 = 'Invalid character inserted'
  }

  // userType validation
  if (Validator.isEmpty(data.userType)) {
    errors.userType = 'User Type is required'
  }
  if (!Validator.isAlpha(data.userType) && !Validator.isEmpty(data.userType)) {
    errors.userType = 'Invalid characters inserted'
  }

  // userRole validation
  if (Validator.isEmpty(data.userRole)) {
    errors.userRole = 'User Role is required'
  }
  if (!Validator.isAlpha(data.userRole) && !Validator.isEmpty(data.userRole)) {
    errors.userRole = 'Invalid characters inserted'
  }

  // password validation
  if (data.password) {
    if (Validator.isEmpty(data.password)) {
      errors.password = 'Password is required'
    }
    if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
      errors.password = 'Password length must be between 6 and 30 characters'
    }
    if (Validator.isEmpty(data.password2)) {
      errors.password2 = 'Password2 is required'
    }
    if (!Validator.equals(data.password, data.password2)) {
      errors.password2 = 'passwords do not match'
    }
  }

  if (!Validator.isBoolean(data.checkinOption.toString())) {
    errors.checkinOption = 'Checkin option must be true of false'
  }

  return {
    msg: errors,
    isValid: isEmpty(errors)
  }
}
