const axios = require("axios")

const createUpdateUser = async (google_id_token) => {
  try{
    
    var createUpdateUserResponse = await axios({
        url: `${process.env.REACT_APP_ssl}://${process.env.REACT_APP_website_name}:${process.env.REACT_APP_gatewayms_port}/gateway`,
        method: 'post',
        data: {
          query: `
            mutation createOrUpdateUser($googleToken: String!){
                User: createOrUpdateUser(googleToken: $googleToken){
                id
                name
                email
                profileUrl
                }
            }
          `,
          variables: {
            googleToken: google_id_token
          }
        },
        withCredentials: true
      });
    
    return createUpdateUserResponse.data
  } catch (err) {
    console.log(err);
  }
};
  
  module.exports = { createUpdateUser };