const axios = require("axios")

const editCaption = async (postID, newCaption) => {
  try{

    var editCaptionVariables={
      "input": {
        "postId": postID,
        "newCaption": newCaption
      }
    };
    
    var response = await axios({
        url: `${process.env.REACT_APP_ssl}://${process.env.REACT_APP_website_name}:${process.env.REACT_APP_gatewayms_port}/gateway`,
        method: 'post',
        data: {
          query: `
          mutation editCaption($input: editCaptionInput!){
            Post: editCaption(input: $input){
              caption
            }
          }
          `,
          variables: editCaptionVariables
        },
        withCredentials: true
      });
    
    return response.data
  } catch (err) {
    console.log(err);
  }
};
  
  module.exports = { editCaption };