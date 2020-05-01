/******************************************************************************
!Title : permission queries
!Auth  : Anthony Pitts
!desc  : Contains all permissions service queries
******************************************************************************/
require("module-alias/register");
const { logFail } = require("@config/logger");
const { logger } = require("@config/logger.js");
const validateInput = require("../../validation/validateInput.js");
// Models
const Role = require("../../models/Role-model.js");
const Permission = require("../../models/Permission-model.js");
const RolePermission = require("../../models/RolePermission-model.js");
const UserRole = require("../../models/UserRole-model.js");

const getAllRolesQuery = async () => {
  try {
    let roles = await Role.find();
    return roles;
  } catch (err) {
    logFail("getRoleQuery", err);
    throw err;
  }
};

const getAllPermsQuery = async () => {
  try {
    let permissions = await Permission.find();

    return permissions;
  } catch (err) {
    logFail("getAllRolesQuery", err);
    throw err;
  }
};

const getRoleQuery = async (_, { id }) => {
  try {
    validateInput({ roleID: id }, "getRoleQuery");
    const role = await Role.findById(id);
    return role;
  } catch (err) {
    logFail("getRoleQuery", err);
    throw err;
  }
};

const getRolePermissionsQuery = async (_, { roleID }) => {
  try {
    validateInput({ roleID: roleID }, "getRolePermissionsQuery");
    const rolePermissions = await RolePermission.find({ roleID: roleID });
    return rolePermissions;
  } catch (err) {
    logFail("getRolePermissionsQuery", err);
    throw err;
  }
};

const getUserRolesQuery = async (_, { userID }) => {
  try {
    validateInput({ userID: userID }, "getUserRolesQuery");
    const userRoles = await UserRole.find({ userID: userID });
    return userRoles;
  } catch (err) {
    logFail("getUserRolesQuery", err);
    throw err;
  }
};

module.exports = {
  getAllRolesQuery,
  getAllPermsQuery,
  getRoleQuery,
  getRolePermissionsQuery,
  getUserRolesQuery
};
