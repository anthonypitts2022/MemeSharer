/******************************************************************************
!Title : handleReturnGQLErrors
!Auth  : ya2369
!desc  : Handles all of the errors sent to graphql
******************************************************************************/
const isEmpty = require("../app/validation/is-empty");

const handleReturnGQLErrors = msg => {
  throw new Error(JSON.stringify(msg));
};

const handleErrors = {
  duplicateRoleNameOnCreate: role => {
    if (role) {
      handleReturnGQLErrors({
        roleName: "This role name already exists"
      });
    }
  },
  duplicatePermNameOnCreate: permission => {
    if (permission) {
      handleReturnGQLErrors({
        permName: "This permission name already exists"
      });
    }
  },
  duplicateRolePermOnCreate: rolePerm => {
    if (rolePerm) {
      handleReturnGQLErrors({
        roleID: "This permission is already in the role"
      });
    }
  },
  duplicateUserRoleOnCreate: userRole => {
    if (userRole) {
      handleReturnGQLErrors({
        userID: "This user is already in the role"
      });
    }
  },
  noExistingPermission: permission => {
    if (!permission) {
      handleReturnGQLErrors({
        appError: "This permission does not exist"
      });
    }
  },
  noExistingRole: role => {
    if (!role) {
      handleReturnGQLErrors({
        appError: "This role does not exist"
      });
    }
  },
  validateInputErrors: errors => {
    if (!isEmpty(errors)) {
      handleReturnGQLErrors(errors);
    }
  },
  invalidAuthToken: msg => {
    handleReturnGQLErrors({
      invalidToken: `${msg}`
    })
  },
  permissionDenied: msg => {
    handleReturnGQLErrors({
      permissionDenied: `${msg}`
    })
  }
};

module.exports = { handleErrors };
