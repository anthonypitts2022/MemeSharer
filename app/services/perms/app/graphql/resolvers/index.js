/******************************************************************************
!Title : Index
!Auth  : Anthony Pitts
!desc  : The entry point for all queries and mutaitons for the perm service
******************************************************************************/

const { logFail } = require("@config/logger");
const {
  getAllRolesQuery,
  getAllPermsQuery,
  getRoleQuery,
  getRolePermissionsQuery,
  getUserRolesQuery
} = require("./perms-queries.js");
const {
  createRoleMutation,
  addRolePermissionMutation,
  addUserRoleMutation,
  removeUserRoleMutation,
  removePermissionFromRoleMutation,
  createPermissionMutation,
  deleteRoleMutation,
  deletePermissionMutation
} = require("./perms-mutations.js");
// Models
const Roles = require("../../models/Role-model.js");
const Permissions = require("../../models/Permission-model.js");
const RolePermissions = require("../../models/RolePermission-model.js");

//==============================================================================
// Resolvers
//==============================================================================

const Query = {
  getAllRoles: getAllRolesQuery,
  getAllPerms: getAllPermsQuery,
  getRole: getRoleQuery,
  getRolePermissions: getRolePermissionsQuery,
  getUserRoles: getUserRolesQuery
};

const Mutation = {
  createRole: createRoleMutation,
  addRolePermission: addRolePermissionMutation,
  addUserRole: addUserRoleMutation,
  removeUserRole: removeUserRoleMutation,
  removePermissionFromRole: removePermissionFromRoleMutation,
  createPermission: createPermissionMutation,
  deleteRole: deleteRoleMutation,
  deletePermission: deletePermissionMutation
};

const Role = {
  rolePermissions: async rolePermission => {
    try {
      let rolePermssions = RolePermissions.find({
        roleID: rolePermission.id
      });
      return rolePermssions;
    } catch (err) {
      logFail("Role.rolePermissions", { error: err });
      throw err;
    }
  }
};

const UserRole = {
  role: async role => {
    try {
      let getRole = await Roles.findOne({ _id: role.roleID });
      return getRole;
    } catch (err) {
      logFail("UserRole.role", { error: err });
      throw err;
    }
  }
};

const RolePermission = {
  role: async rolePermission => {
    try {
      let role = await Roles.findById(rolePermission.roleID);
      return role;
    } catch (err) {
      logFail("RolePermission.role", { error: err });
      throw err;
    }
  },
  permission: async rolePermission => {
    try {
      let permission = await Permissions.findById(rolePermission.permID);
      return permission;
    } catch (err) {
      logFail("RolePermission.permission", { error: err });
      throw err;
    }
  }
};

module.exports = { Query, Mutation, UserRole, Role, RolePermission };
