const axios = require("axios")

const followUser = async (followerID, followeeID) => {
  try{

    var createFollowshipVariables={
      "input": {
        "followerId": followerID,
        "followeeId": followeeID
      }
    };
    
    var response = await axios({
        url: `${process.env.REACT_APP_ssl}://${process.env.REACT_APP_website_name}:${process.env.REACT_APP_gatewayms_port}/gateway`,
        method: 'post',
        data: {
          query: `
          mutation createFollowship($input: followshipInput!){
            Followship: createFollowship(input: $input){
              followerId
            }
          }
          `,
          variables: createFollowshipVariables
        },
        withCredentials: true
      });
    
    return response.data
  } catch (err) {
    console.log(err);
  }
};
  
  module.exports = { followUser };