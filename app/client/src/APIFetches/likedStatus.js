const axios = require("axios")

const likedStatus = async (postID, userID) => {
  try{

    var getLikedVariables= {
      "input": { 
        "postId": postID, 
        "userId": userID 
      } 
    };
    
    var response = await axios({
        url: `${process.env.REACT_APP_ssl}://${process.env.REACT_APP_website_name}:${process.env.REACT_APP_gatewayms_port}/gateway`,
        method: 'post',
        data: {
          query: `
          query liked($input: likedInput!){
            Like: liked(input: $input){
              isLike
            }
          }
          `,
          variables: getLikedVariables
        },
        withCredentials: true
      });
    
    return response.data
  } catch (err) {
    console.log(err);
  }
};
  
  module.exports = { likedStatus };