const axios = require("axios")

const deletePost = async (postID) => {
  try{

    var deletePostVariables = {
      "id": postID
    };
    
    var response = await axios({
        url: `${process.env.REACT_APP_ssl}://${process.env.REACT_APP_website_name}:${process.env.REACT_APP_gatewayms_port}/gateway`,
        method: 'post',
        data: {
          query: `
          mutation deletePost($id: String!){
            deletePost(id: $id)
          }
          `,
          variables: deletePostVariables
        },
        withCredentials: true
      });
    
    return response.data
  } catch (err) {
    console.log(err);
  }
};
  
  module.exports = { deletePost };