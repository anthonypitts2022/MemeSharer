/******************************************************************************
!Title : handleErrors
!Auth  : Anthony Pitts
!desc  : Handles all of the errors sent from this API
******************************************************************************/
const isEmpty = require("../app/validation/is-empty");

const handleReturnGQLErrors = msg => {
  throw new Error(JSON.stringify(msg))
};

const handleErrors = {
  error: msg => {
    handleReturnGQLErrors({
      error: `${msg}`
    })
  },
  invalidAccessToken: msg => {
    handleReturnGQLErrors({
      invalidAccessToken: `${msg}`
    })
  },
  invalidGoogleToken: msg => {
    handleReturnGQLErrors({
      invalidGoogleToken: `${msg}`
    })
  },
  invalidRefreshToken: msg => {
    handleReturnGQLErrors({
      invalidRefreshToken: `${msg}`
    })
  },
  invalidRefreshTokenSecret: msg => {
    handleReturnGQLErrors({
      invalidRefreshTokenSecret: `${msg}`
    })
  },
  invalidIDInput: msg => {
    handleReturnGQLErrors({
      invalidIDInput: `${msg}`
    })
  },
  permissionDenied: msg => {
    handleReturnGQLErrors({
      permissionDenied: `${msg}`
    })
  },
  
};

module.exports = { handleErrors };
