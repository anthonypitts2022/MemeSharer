const axios = require("axios")

const createComment = async (text, postID, userID) => {
  try{

    var createCommentVariables={
      "input": {
        "text": text,
        "postId": postID,
        "userId": userID
      }
    };
    
    var response = await axios({
        url: `${process.env.REACT_APP_ssl}://${process.env.REACT_APP_website_name}:${process.env.REACT_APP_gatewayms_port}/gateway`,
        method: 'post',
        data: {
          query: `
          mutation createComment($input: createCommentInput){
            Comment: createComment(input: $input){
              id
              userId
              user{
                name
              }
              postId
              text
            }
          }
          `,
          variables: createCommentVariables
        },
        withCredentials: true
      });
    
    return response.data
  } catch (err) {
    console.log(err);
  }
};
  
  module.exports = { createComment };