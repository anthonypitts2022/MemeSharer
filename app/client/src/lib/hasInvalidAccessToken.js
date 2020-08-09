
const hasInvalidAccessToken = (response) => {

  if(response.errors){
    for(var i=0; i<response.errors.length; i++){
      var errMessage = response.errors[i].message
      var errMessageParsed = JSON.parse(errMessage)
      if(errMessageParsed["invalidAccessToken"]){        
        return true
      }
    }
  }

  return false

};
  
  module.exports = { hasInvalidAccessToken };