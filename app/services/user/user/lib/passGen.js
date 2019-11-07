// !Title : password genarator
// !Auth  : mamnaerd
// !Vers  : 1.0
// !Date  : 6/22/19 *Last Mod
// !Desc  : generates  password

/*
Usage:
generatePassword(length)

*/

const generatePassword = len => {
  var length = len,
    charset =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&',
    retVal = ''
  for (var i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n))
  }
  return retVal
}

module.exports = { generatePassword }
