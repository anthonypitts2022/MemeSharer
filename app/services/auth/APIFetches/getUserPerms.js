const axios = require("axios")
const { handleErrors } = require("@lib/handleErrors");

const getUserPerms = async (userID) => {
  try{

    var getUserPermissionsVariables={
      "userID": userID
    };
    
    var response = await axios({
      url: `${process.env.ssl}://${process.env.website_name}:${process.env.gatewayms_port}/gateway`,
      method: 'post',
      data: {
        query: `
        query getUserPermissions($userID: String!) {
            getUserPermissions(userID: $userID)
        }
        
        `,
        variables: getUserPermissionsVariables
      },
      withCredentials: true
    });      
    
    return response.data

  } catch (err) {
    console.log(err);
    handleErrors.error(err)
  }
};
  
  module.exports = { getUserPerms };