const axios = require("axios")

const getPost = async (postID) => {
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
              fileId
              fileType
              user{
                id
                name
                email
                profileUrl
              }
              id
              caption
              likeCount
              dislikeCount
              comments{
                text
                userId
                user{
                  id
                  name
                }
                id
              }
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
  
  module.exports = { getPost };