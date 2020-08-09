const axios = require("axios")
const { handleErrors } = require("@lib/handleErrors");

const deleteUserRolesByRoleID = async (roleID) => {
  try{
    
    var response = await axios({
      url: `${process.env.ssl}://${process.env.website_name}:${process.env.gatewayms_port}/gateway`,
      method: 'post',
      data: {
        query: `
        mutation deleteUserRolesByRoleID($id: String!){
          deleteUserRolesByRoleID(id: $id)
        }
        `,
        variables: {
          id: roleID
        }
      },
      withCredentials: true
    });      
    
    return response.data

  } catch (err) {
    console.log(err);
    handleErrors.error(err)
  }
};
  
  module.exports = { deleteUserRolesByRoleID };