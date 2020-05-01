/******************************************************************************
!Title : permission mutations
!Auth  : Anthony Pitts
!desc  : Contains all permissions mutations
******************************************************************************/
require("module-alias/register");
const { handleErrors } = require("@config/handleGQLErrors");
const { logSuccess, logFail } = require("@config/logger");
const { logger } = require("@config/logger.js");

const { createApolloFetch } = require("apollo-fetch");
// Models
const Role = require("../../models/Role-model.js");
const RolePermission = require("../../models/RolePermission-model.js");
const UserRole = require("../../models/UserRole-model.js");
const Permission = require("../../models/Permission-model.js");
// Validation
const validateInput = require("../../validation/validateInput.js");
//==============================================================================
// CREATE MUTATIONS
//==============================================================================

const createRoleMutation = async (_, { input }) => {
  try {
    validateInput(input, "createRoleMutation");
    let role = await Role.findOne({ roleName: input.roleName });
    handleErrors.duplicateRoleNameOnCreate(role);
    const newRole = new Role({
      roleName: input.roleName
    });
    const saveNewRole = await newRole.save();
    logSuccess("createRoleMutation", newRole);
    return saveNewRole;
  } catch (err) {
    logFail("createRoleMutation", err);
    throw err;
  }
};

const createPermissionMutation = async (_, { permName }) => {
  try {
    validateInput({ permName: permName }, "createPermissionMutation");
    let permission = await Permission.findOne({ permName: permName });
    handleErrors.duplicatePermNameOnCreate(permission);
    const newPermission = new Permission({
      permName: permName
    });
    const saveNewPermission = newPermission.save();
    logSuccess("createPermissionMutation", saveNewPermission);
    return saveNewPermission;
  } catch (err) {
    logFail("createPermissionMutation", err);
    throw err;
  }
};

const addRolePermissionMutation = async (_, { input }) => {
  try {
    validateInput(input, "addRolePermissionMutation");
    var permission = await Permission.findById(input.permID);
    var role = await Role.findById(input.roleID);
    var rolePerm = await RolePermission.findOne({
      roleID: input.roleID,
      permID: input.permID
    });
    handleErrors.noExistingPermission(permission);
    handleErrors.noExistingRole(role);
    handleErrors.duplicateRolePermOnCreate(rolePerm);
    const newRolePermission = new RolePermission({
      roleID: input.roleID,
      permID: input.permID
    });
    let saveNewRolePermission = await newRolePermission.save();
    logSuccess("addRolePermissionMutation", saveNewRolePermission);
    return saveNewRolePermission;
  } catch (err) {
    logFail("addRolePermissionMutation", err);
    throw err;
  }
};

const addUserRoleMutation = async (_, { input }) => {
  try {
    validateInput(input, "addUserRoleMutation");
    var role = await Role.findById(input.roleID);
    var userRole = await UserRole.findOne({
      roleID: input.roleID,
      userID: input.userID
    });
    handleErrors.noExistingRole(role);
    handleErrors.duplicateUserRoleOnCreate(userRole);
    const newUserRole = new UserRole({
      roleID: input.roleID,
      userID: input.userID
    });
    let saveNewUserRole = await newUserRole.save();
    logSuccess("addUserRoleMutation", saveNewUserRole);
    return saveNewUserRole;
  } catch (err) {
    logFail("addUserRoleMutation", err);
    throw err;
  }
};

//==============================================================================
// DELETE MUTATIONS
//==============================================================================
const removePermissionFromRoleMutation = async (_, { input }) => {
  try {
    var rolePermissionToDelete = await RolePermission.deleteOne({
      roleID: input.roleID,
      permissionID: input.permissionID
    });

    return true;
  } catch (err) {
    logFail("removePermissionFromRoleMutation", err);
    return;
  }
};

const deleteRoleMutation = async (_, { id }) => {
  try {
    //check if role exists
    var role = await Role.findById(id);
    if (!role) {
      logger.error("Role doesn't exist");
      return false;
    }
    await RolePermission.deleteMany({ roleID: id });
    await Role.findByIdAndDelete(id);
    var fetch = createApolloFetch({
      uri: `${process.env.ssl}://${process.env.website_name}:${process.env.gatewayms_port}/gateway`
    });
    await fetch({
      query: `
      mutation deleteUserRolesByRoleID($id: String!){
        deleteUserRolesByRoleID(id: $id)
      }
      `,
      variables: {
        id: id
      }
    });

    return true;
  } catch (err) {
    logFail("deleteRoleMutation", err);
    return false;
  }
};

const removeUserRoleMutation = async (_, { input }) => {
  try {
    validateInput(input, "removeUserRoleMutation");

    let deleted = await UserRole.deleteMany({
      roleID: input.roleID,
      userID: input.userID
    });
    
    logSuccess("removeUserRoleMutation", deleted);
    return true;
  } catch (err) {
    logFail("removeUserRoleMutation", err);
    return false;
  }
};

const deletePermissionMutation = async (_, { permissionID }) => {
  try {
    var perm = await Permission.findById(permissionID);
    if (!perm) {
      logger.error("Permission doesn't exist");
      return handleErrors.noExistingPermission(perm);
    }
    await RolePermission.deleteMany({ permissionID: permissionID });
    await Permission.findByIdAndDelete(permissionID);
    return true;
  } catch (err) {
    logFail("deletePermissionMutation", err);
    return false;
  }
};

module.exports = {
  createRoleMutation,
  addRolePermissionMutation,
  addUserRoleMutation,
  removeUserRoleMutation,
  removePermissionFromRoleMutation,
  createPermissionMutation,
  deleteRoleMutation,
  deletePermissionMutation
};
