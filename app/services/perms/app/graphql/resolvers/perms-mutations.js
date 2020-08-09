/******************************************************************************
!Title : permission mutations
!Auth  : Anthony Pitts
!desc  : Contains all permissions mutations
******************************************************************************/
require("module-alias/register");
const { handleErrors } = require("@lib/handleErrors");
const { logSuccess, logFail } = require("@config/logger");
const { logger } = require("@config/logger.js");
const { AuthenticateAccessToken } = require('../../../lib/AuthenticateAccessToken')
const { deleteUserRolesByRoleID } = require('../../../APIFetches/deleteUserRolesByRoleID')


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

const createRoleMutation = async (_, { input }, { req }) => {
  try {

    validateInput(input, "createRoleMutation");

    //Get the signed-in user's decrypted auth token payload
    const accessTokenData = new AuthenticateAccessToken(req);

    //'invalid user auth token or not signed in'
    if(accessTokenData.errors) return handleErrors.invalidAccessToken(accessTokenData.errors)

    //if signed in user doesn't have access to create a role
    if(!accessTokenData.hasPermission(`createRole`)) 
      return handleErrors.permissionDenied(`Signed in user doesn't have access to create a role`)

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
  }
};

const createPermissionMutation = async (_, { permName }, { req }) => {
  try {

    validateInput({ permName: permName }, "createPermissionMutation");

    //Get the signed-in user's decrypted auth token payload
    const accessTokenData = new AuthenticateAccessToken(req);

    //invalid user auth token or not signed in
    if(accessTokenData.errors) return handleErrors.invalidAccessToken(accessTokenData.errors)

    //if signed in user doesn't have access to create a permission
    if(!accessTokenData.hasPermission(`createPermission`)) 
      return handleErrors.permissionDenied(`Signed in user doesn't have access to create a permission`)

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
  }
};

const addRolePermissionMutation = async (_, { input }, { req }) => {
  try {

    validateInput(input, "addRolePermissionMutation");

    //Get the signed-in user's decrypted auth token payload
    const accessTokenData = new AuthenticateAccessToken(req);

    //invalid user auth token or not signed in
    if(accessTokenData.errors) return handleErrors.invalidAccessToken(accessTokenData.errors)

    //if signed in user doesn't have access to add role permission
    if(!accessTokenData.hasPermission(`addRolePermission`)) 
      return handleErrors.permissionDenied(`Signed in user doesn't have access to add role permission`)

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
  }
};

const addUserRoleMutation = async (_, { input }, { req }) => {
  try {

    validateInput(input, "addUserRoleMutation");

    //Get the signed-in user's decrypted auth token payload
    const accessTokenData = new AuthenticateAccessToken(req);

    //invalid user auth token or not signed in
    if(accessTokenData.errors) return handleErrors.invalidAccessToken(accessTokenData.errors)

    //if signed in user doesn't have access to add user role
    if(!accessTokenData.hasPermission(`addUserRole`)) 
      return handleErrors.permissionDenied(`Signed in user doesn't have access to add user role`)

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
  }
};

//==============================================================================
// DELETE MUTATIONS
//==============================================================================
const removePermissionFromRoleMutation = async (_, { input }, { req }) => {
  try {

    //Get the signed-in user's decrypted auth token payload
    const accessTokenData = new AuthenticateAccessToken(req);

    //invalid user auth token or not signed in
    if(accessTokenData.errors) return handleErrors.invalidAccessToken(accessTokenData.errors)

    //if signed in user doesn't have access to remove permission from role
    if(!accessTokenData.hasPermission(`removePermissionFromRole`)) 
      return handleErrors.permissionDenied(`Signed in user doesn't have access to remove permission from role`)

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

const deleteRoleMutation = async (_, { id }, { req }) => {
  try {

    //Get the signed-in user's decrypted auth token payload
    const accessTokenData = new AuthenticateAccessToken(req);

    //invalid user auth token or not signed in
    if(accessTokenData.errors) return handleErrors.invalidAccessToken(accessTokenData.errors)

    //if signed in user doesn't have access to delete a role
    if(!accessTokenData.hasPermission(`deleteRole`)) 
      return handleErrors.permissionDenied(`Signed in user doesn't have access to delete a role`)

    //check if role exists
    var role = await Role.findById(id);
    if (!role) {
      logger.error("Role doesn't exist");
      return false;
    }
    await RolePermission.deleteMany({ roleID: id });
    await Role.findByIdAndDelete(id);
    
    await deleteUserRolesByRoleID(id)

    return true;
  } catch (err) {
    logFail("deleteRoleMutation", err);
    return false;
  }
};

const removeUserRoleMutation = async (_, { input }, { req }) => {
  try {
    validateInput(input, "removeUserRoleMutation");

    //Get the signed-in user's decrypted auth token payload
    const accessTokenData = new AuthenticateAccessToken(req);

    //invalid user auth token or not signed in
    if(accessTokenData.errors) return handleErrors.invalidAccessToken(accessTokenData.errors)

    //if signed in user doesn't have access to remove user role
    if(!accessTokenData.hasPermission(`removeUserRole`)) 
      return handleErrors.permissionDenied(`Signed in user doesn't have access to remove a user role`)

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

const deletePermissionMutation = async (_, { permissionID }, { req }) => {
  try {

    //Get the signed-in user's decrypted auth token payload
    const accessTokenData = new AuthenticateAccessToken(req);

    //invalid user auth token or not signed in
    if(accessTokenData.errors) return handleErrors.invalidAccessToken(accessTokenData.errors)

    //if signed in user doesn't have access to delete a permission
    if(!accessTokenData.hasPermission(`deletePermission`)) 
      return handleErrors.permissionDenied(`Signed in user doesn't have access to delete a permission`)

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
