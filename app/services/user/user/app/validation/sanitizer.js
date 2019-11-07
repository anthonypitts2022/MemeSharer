//==============================================================================
/*
___  __ _ _ __ (_) |_(_)_______ _ __
/ __|/ _` | '_ \| | __| |_  / _ \ '__|
\__ \ (_| | | | | | |_| |/ /  __/ |
|___/\__,_|_| |_|_|\__|_/___\___|_|

*/
//==============================================================================

/*
Title: Sanitizer
Auth: aep2195
Vers: 1.0
date: 9/20/19 *Last ModBODY
desc: Sanitizes the input
*/

//==============================================================================
// Head
//==============================================================================

const Validator = require("validator");
const isEmpty = require("./is-empty");

//==============================================================================
// BODY
//==============================================================================

module.exports = function sanitizer(data) {

  //iterate over the input data
  for (var key in data) {
    // check if has key prop
    if (data.hasOwnProperty(key)) {

      //----------- blacklist sanitation ---------------------//
      //removes certain blacklisted characters from all data fields
      if(typeof(data[key])=="string"){
        data[key] = Validator.blacklist(data[key], '\\{\\}\\[\\]\\`\\;');


        //----------- noramlize email sanitation ---------------------//
        if(Validator.isEmail(data[key])){
          //normalize email will perform a set of sanitations, such as
          //     make all letters before @ lowercase
          data[key] = Validator.normalizeEmail(data[key]);
        }
      }
    }
  }

  return {
    sanitizedData: data
  };
};
