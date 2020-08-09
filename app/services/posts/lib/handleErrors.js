/******************************************************************************
!Title : handleErrors
!Auth  : Anthony Pitts
!desc  : Handles all of the errors sent from this API
******************************************************************************/
const isEmpty = require("../app/validation/is-empty");

const handleReturnGQLErrors = msg => {
  throw new Error(JSON.stringify(msg));
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
  invalidPostInput: msg => {
    handleReturnGQLErrors({
      invalidPostInput: `${msg}`
    })
  },
  invalidCommentInput: msg => {
    handleReturnGQLErrors({
      invalidCommentInput: `${msg}`
    })
  },
  invalidCaptionInput: msg => {
    handleReturnGQLErrors({
      invalidCaptionInput: `${msg}`
    })
  },
  invalidFollowshipInput: msg => {
    handleReturnGQLErrors({
      invalidFollowshipInput: `${msg}`
    })
  },
  invalidIDInput: msg => {
    handleReturnGQLErrors({
      invalidIDInput: `${msg}`
    })
  },
  invalidLikeInput: msg => {
    handleReturnGQLErrors({
      invalidLikeInput: `${msg}`
    })
  },
  invalidIndex: msg => {
    handleReturnGQLErrors({
      invalidIndex: `${msg}`
    })
  },
  alreadyLiked: msg => {
    handleReturnGQLErrors({
      alreadyLiked: `${msg}`
    })
  },
  alreadyDisliked: msg => {
    handleReturnGQLErrors({
      alreadyDisliked: `${msg}`
    })
  },
  noUserID: msg => {
    handleReturnGQLErrors({
      noUserID: `${msg}`
    })
  },
  noExistingPost: () => {
    handleReturnGQLErrors({
      appError: "This post does not exist"
    });
  },
};

module.exports = { handleErrors };
