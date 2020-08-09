const axios = require("axios")

// call refreshAccessToken API endpoint on auth Microservice
// if successful, access token will be updated, else the user is sent to /login
const refreshAccessToken = async () => {
  try{
    
    var response = await axios({
        url: `${process.env.REACT_APP_ssl}://${process.env.REACT_APP_website_name}:${process.env.REACT_APP_gatewayms_port}/gateway`,
        method: 'post',
        data: {
          query: `
          mutation refreshAccessToken{
            refreshAccessToken
          }
          `
        },
        withCredentials: true
    });
    
    if(!response.errors)
      return true
    else{
      localStorage.removeItem('user')
      window.location = "/login"
      return false
    }

  } catch (err) {
    console.log(err);
    localStorage.removeItem('user')
    window.location = "/login"
    return false
  }
};
  
  module.exports = { refreshAccessToken };