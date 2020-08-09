const axios = require("axios")

const userPosts = async (index, userID) => {
  try{

    var userPostsVariables={
      input: {
        "index": index,
        "userId": userID
      }
    };
    
    var response = await axios({
        url: `${process.env.REACT_APP_ssl}://${process.env.REACT_APP_website_name}:${process.env.REACT_APP_gatewayms_port}/gateway`,
        method: 'post',
        data: {
          query: `
          query userPosts($input: userPostsInput!){
            PostsAndHasNext: userPosts(input: $input){
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
          variables: userPostsVariables
        },
        withCredentials: true
      });
    
    return response.data
  } catch (err) {
    console.log(err);
  }
};
  
  module.exports = { userPosts };