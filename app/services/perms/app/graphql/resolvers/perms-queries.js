/******************************************************************************
!Title : permission queries
!Auth  : Anthony Pitts
!desc  : Contains all permissions service queries
******************************************************************************/
require("module-alias/register");
const { logFail } = require("@config/logger");
const { logger } = require("@config/logger.js");
const validateInput = require("../../validation/validateInput.js");
const { AuthenticateAccessToken } = require('../../../lib/AuthenticateAccessToken');
const { handleErrors } = require("@lib/handleErrors");


// Models
const Role = require("../../models/Role-model.js");
const Permission = require("../../models/Permission-model.js");
const RolePermission = require("../../models/RolePermission-model.js");
const UserRole = require("../../models/UserRole-model.js");

const getAllRolesQuery = async (_, __, { req }) => {
  try {

    //Get the signed-in user's decrypted auth token payload
    const accessTokenData = new AuthenticateAccessToken(req);

    //invalid user auth token or not signed in
    if(accessTokenData.errors) return handleErrors.invalidAccessToken(accessTokenData.errors)

    //if signed in user doesn't have access to get all roles
    if(!accessTokenData.hasPermission(`getAllRoles`)) 
      return handleErrors.permissionDenied(`Signed in user doesn't have access to get all roles`)

    let roles = await Role.find().limit(400);
    return roles;

  } catch (err) {
    logFail("getRoleQuery", err);
    throw err;
  }
};

const getAllPermsQuery = async (_, __, { req }) => {
  try {

    //Get the signed-in user's decrypted auth token payload
    const accessTokenData = new AuthenticateAccessToken(req);

    //invalid user auth token or not signed in
    if(accessTokenData.errors) return handleErrors.invalidAccessToken(accessTokenData.errors)

    //if signed in user doesn't have access to get all perms
    if(!accessTokenData.hasPermission(`getAllPerms`)) 
      return handleErrors.permissionDenied(`Signed in user doesn't have access to get all perms`)

    let permissions = await Permission.find().limit(400);

    return permissions;
  } catch (err) {
    logFail("getAllPermsQuery", err);
    throw err;
  }
};

const getRoleQuery = async (_, { id }, { req }) => {
  try {

    validateInput({ roleID: id }, "getRoleQuery");

    const role = await Role.findById(id);
    
    if(role) return role;

    else return handleErrors.noExistingRole()
    
  } catch (err) {
    logFail("getRoleQuery", err);
    throw err;
  }
};

const getRolePermissionsQuery = async (_, { roleID }, { req }) => {
  try {
    validateInput({ roleID: roleID }, "getRolePermissionsQuery");
    const rolePermissions = await RolePermission.find({ roleID: roleID });
    return rolePermissions;
  } catch (err) {
    logFail("getRolePermissionsQuery", err);
    throw err;
  }
};

const getUserRolesQuery = async (_, { userID }, { req }) => {
  try {
    validateInput({ userID: userID }, "getUserRolesQuery");
    const userRoles = await UserRole.find({ userID: userID });
    return userRoles;
  } catch (err) {
    logFail("getUserRolesQuery", err);
    throw err;
  }
};


const getUserPermissionsQuery = async (_, { userID }, { req }) => {
  try {

    var permissions = []

    const userRoles = await UserRole.find({ userID: userID });
    
    for(var i=0; i<userRoles.length; i++){
      var roleID = userRoles[i].roleID
      var rolePermissions = await RolePermission.find({roleID: roleID})
      for(var j=0; j<rolePermissions.length; j++){
        var permission = await Permission.findById(rolePermissions[j].permID)
        if(permission){
          permissions.push(permission.permName)
        }
      }
    }

    return permissions; // ['deleteAllPosts', 'deleteAllComments',,,]

  } catch (err) {
    logFail("getUserPermissionsQuery", err);
    throw err;
  }
};

module.exports = {
  getAllRolesQuery,
  getAllPermsQuery,
  getRoleQuery,
  getRolePermissionsQuery,
  getUserRolesQuery,
  getUserPermissionsQuery
};
