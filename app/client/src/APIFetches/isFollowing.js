const axios = require("axios")

const isFollowing = async (followerID, followeeID) => {
  try{

    var isFollowingVariables={
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
          query isFollowing($input: followshipInput!){
            isFollowing(input: $input)
          }
          `,
          variables: isFollowingVariables
        },
        withCredentials: true
      });
    
    return response.data
  } catch (err) {
    console.log(err);
  }
};
  
  module.exports = { isFollowing };