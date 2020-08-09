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
  permissionDenied: msg => {
    handleReturnGQLErrors({
      permissionDenied: `${msg}`
    })
  },
  invalidGoogleToken: msg => {
    handleReturnGQLErrors({
      invalidGoogleToken: `${msg}`
    })
  },
};

module.exports = { handleErrors };
