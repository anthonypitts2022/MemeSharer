const axios = require("axios")

const feedPosts = async (index, userID) => {
  try{

    var feedPostsVariables={
      "input": {
        "index": index,
        "userId": userID
      }
    };
    
    var response = await axios({
        url: `${process.env.REACT_APP_ssl}://${process.env.REACT_APP_website_name}:${process.env.REACT_APP_gatewayms_port}/gateway`,
        method: 'post',
        data: {
          query: `
          query feedPosts($input: feedPostsInput!){
            PostsAndHasNext: feedPosts(input: $input){
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
          variables: feedPostsVariables
        },
        withCredentials: true
      });
    
    return response.data
  } catch (err) {
    console.log(err);
  }
};
  
  module.exports = { feedPosts };