const axios = require("axios")

const postLikeStatus = async (postID) => {
  try{

    var queryPostVariables = {
      "id": postID
    };
    
    var response = await axios({
        url: `${process.env.REACT_APP_ssl}://${process.env.REACT_APP_website_name}:${process.env.REACT_APP_gatewayms_port}/gateway`,
        method: 'post',
        data: {
          query: `
          query getAPost($id: String!){
            Post: getAPost(id: $id){
              likeCount
              dislikeCount
            }
          }
          `,
          variables: queryPostVariables
        },
        withCredentials: true
      });
    
    return response.data
  } catch (err) {
    console.log(err);
  }
};
  
  module.exports = { postLikeStatus };