const axios = require("axios")

const globalPosts = async (index) => {
  try{

    var globalPostsVariables={
      "index": index
    };
    
    var response = await axios({
        url: `${process.env.REACT_APP_ssl}://${process.env.REACT_APP_website_name}:${process.env.REACT_APP_gatewayms_port}/gateway`,
        method: 'post',
        data: {
          query: `
          query globalPosts($index: String!){
            PostsAndHasNext: globalPosts(index: $index){
              posts{
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
            hasNext
            }
          }
          `,
          variables: globalPostsVariables
        },
        withCredentials: true
      });
    
    return response.data
  } catch (err) {
    console.log(err);
  }
};
  
  module.exports = { globalPosts };