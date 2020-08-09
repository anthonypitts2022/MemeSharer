const axios = require("axios")


const uploadPost = async (fileData) => {
  try{

    // fetch the auth service to generate access and refresh tokens for this user
    var response = await axios({
      url: `${process.env.REACT_APP_ssl}://${process.env.REACT_APP_website_name}:${process.env.REACT_APP_postsms_port}/upload`,
      method: 'post',
      data: fileData,
      withCredentials: true
    });    
    
    return response.data
  } catch (err) {
    console.log(err)
  }
};


  module.exports = { uploadPost };