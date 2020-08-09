const axios = require("axios")
const { handleErrors } = require("../lib/handleErrors");


const createPost = async (createPostVariables, accessToken) => {
  try{
    
    //you have to send the set-cookie header with this request
    var response = await axios({
      url: `${process.env.ssl}://${process.env.website_name}:${process.env.gatewayms_port}/gateway`,
      method: 'post',
      data: {
        query:`
        mutation createPost($input: createPostInput){
          Post: createPost(input: $input){
            id
          }
        }
        `,
        variables: createPostVariables
      },
      withCredentials: true,
      headers: {
        "cookie": `accesstoken=${accessToken.split(" ")[0] +"%20"+ accessToken.split(" ")[1]}`,
        "Access-Control-Allow-Headers": "cookie"
      }
    });

    return response.data

  } catch (err) {
    console.log(err);
    handleErrors.error(err)
  }
};
  
  module.exports = { createPost };