const axios = require("axios")
const { handleErrors } = require("../lib/handleErrors");


const getUser = async (id) => {
  try{

    var getUserResponse = await axios({
      url: `${process.env.ssl}://${process.env.website_name}:${process.env.gatewayms_port}/gateway`,
      method: 'post',
      data: {
        query: `
        query user($id: String!){
          User: user(id: $id){
            id
            name
            email
            profileUrl
          }
        }
        `,
        variables: {
          id: id
        }
      },
      withCredentials: true
    });      
    
    return getUserResponse.data

  } catch (err) {
    console.log(err);
    handleErrors.error(err)
  }
};
  
  module.exports = { getUser };