const axios = require("axios")
const { handleErrors } = require("@lib/handleErrors");


const createFollowship = async (followerId, followeeId) => {
  try{

    var createFollowshipVariables={
      "input": {
        "followerId": followerId,
        "followeeId": followeeId
      }
    };
    
    var response = await axios({
      url: `${process.env.ssl}://${process.env.website_name}:${process.env.gatewayms_port}/gateway`,
      method: 'post',
      data: {
        query: `
        mutation createFollowship($input: followshipInput!){
          Followship: createFollowship(input: $input){
            followerId
            followeeId
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
    handleErrors.error(err)
  }
};
  
  module.exports = { createFollowship };