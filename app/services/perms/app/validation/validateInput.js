/******************************************************************************
!Title : validateInput
!Auth  : ya2369
!desc  : Validates the department input
******************************************************************************/
// Modules
require("module-alias/register");
const Validator = require("validator");
const { handleErrors } = require("@lib/handleErrors");
const isEmpty = require("./is-empty");

const validateRoleName = (roleName, errors) => {
  if (Validator.isEmpty(roleName)) {
    errors.roleName = "Role name is required";
  }
  if (
    !Validator.isAlphanumeric(Validator.blacklist(roleName, "\\-\\_ ")) &&
    !Validator.isEmpty(roleName)
  ) {
    errors.roleName = "Invalid character inserted";
  }
  if (!Validator.isLength(roleName, { max: 50 })) {
    errors.roleName = "Maximum allowed characters is  50";
  }
};

const validatePermName = (permName, errors) => {
  if (Validator.isEmpty(permName)) {
    errors.permName = "Permission name is required";
  }
  if (
    !Validator.isAlphanumeric(Validator.blacklist(permName, "\\-\\_ ")) &&
    !Validator.isEmpty(permName)
  ) {
    errors.permName = "Invalid character inserted";
  }
  if (!Validator.isLength(permName, { max: 50 })) {
    errors.permName = "Maximum allowed characters is  50";
  }
};

const validateRoleID = (roleID, errors) => {
  if (Validator.isEmpty(roleID)) {
    errors.roleID = "ID is required";
  }
  if (!Validator.isLength(roleID, { min: 0, max: 25 })) {
    errors.roleID = "Maximum allowed characters is  25";
  }
};

const validatePermID = (permID, errors) => {
  if (Validator.isEmpty(permID)) {
    errors.permID = "ID is required";
  }
  if (!Validator.isLength(permID, { min: 0, max: 25 })) {
    errors.permID = "Maximum allowed characters is  25";
  }
};

const validateUserID = (userID, errors) => {
  if (Validator.isEmpty(userID)) {
    errors.userID = "ID is required";
  }
  if (!Validator.isLength(userID, { min: 0, max: 25 })) {
    errors.userID = "Maximum allowed characters is  25";
  }
};

const sanatizeData = data => {
  data.roleName = !isEmpty(data.roleName) ? data.roleName : "";
  data.permName = !isEmpty(data.permName) ? data.permName : "";
  data.roleID = !isEmpty(data.roleID) ? data.roleID : "";
  data.permID = !isEmpty(data.permID) ? data.permID : "";
  return { cleanData: data };
};

const dataValidation = {
  createRoleMutation: (data, errors) => {
    validateRoleName(data.roleName, errors);
  },
  createPermissionMutation: (data, errors) => {
    validatePermName(data.permName, errors);
  },
  addRolePermissionMutation: (data, errors) => {
    validateRoleID(data.roleID, errors);
    validatePermID(data.permID, errors);
  },
  addUserRoleMutation: (data, errors) => {
    validateRoleID(data.roleID, errors);
    validateUserID(data.userID, errors);
  },
  removeUserRoleMutation: (data, errors) => {
    validateRoleID(data.roleID, errors);
    validateUserID(data.userID, errors);
  },
  getRolePermissionsQuery: (data, errors) => {
    validateRoleID(data.roleID, errors);
  },
  getRoleQuery: (data, errors) => {
    validateRoleID(data.roleID, errors);
  },
  getUserRolesQuery: (data, errors) => {
    validateUserID(data.userID, errors);
  }
};

module.exports = function validateInput(data, functionName) {
  let errors = {};
  const { cleanData } = sanatizeData(data);
  dataValidation[functionName](cleanData, errors);
  handleErrors.validateInputErrors(errors);
};
