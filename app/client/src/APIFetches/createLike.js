const axios = require("axios")

const createLike = async (isLike, postID, userID) => {
  try{

    var createLikeVariables={
      "input": { 
        "isLike": isLike, 
        "postId": postID, 
        "userId": userID 
      } 
    };
    
    var response = await axios({
        url: `${process.env.REACT_APP_ssl}://${process.env.REACT_APP_website_name}:${process.env.REACT_APP_gatewayms_port}/gateway`,
        method: 'post',
        data: {
          query: `
          mutation createLike($input: createLikeInput){
            Like: createLike(input: $input){
              isLike
            }
          }
          `,
          variables: createLikeVariables
        },
        withCredentials: true
      });
    
    return response.data
  } catch (err) {
    console.log(err);
  }
};
  
  module.exports = { createLike };