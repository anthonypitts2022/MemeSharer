const axios = require("axios")

const unfollowUser = async (followerID, followeeID) => {
  try{

    var deleteFollowshipVariables={
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
          mutation deleteFollowship($input: followshipInput!){
            deleteFollowship(input: $input)
          }
          `,
          variables: deleteFollowshipVariables
        },
        withCredentials: true
      });
    
    return response.data
  } catch (err) {
    console.log(err);
  }
};
  
  module.exports = { unfollowUser };