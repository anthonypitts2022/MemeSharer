const axios = require("axios")


const getAuthTokens = async (google_id_token) => {
  try{
    // fetch the auth service to generate access and refresh tokens for this user
    var getAuthTokensResponse = await axios({
      url: `${process.env.REACT_APP_ssl}://${process.env.REACT_APP_website_name}:${process.env.REACT_APP_gatewayms_port}/gateway`,
      method: 'post',
      data: {
        query: `
          mutation getAuthTokensFromLogin($googleToken: String!){
            getAuthTokensFromLogin(googleToken: $googleToken)
          }
        `,
        variables: {
          googleToken: google_id_token
        }
      },
      withCredentials: true
    });    
    
    return getAuthTokensResponse.data

  } catch(err){
    console.log(err)
  }
  };


  module.exports = { getAuthTokens };