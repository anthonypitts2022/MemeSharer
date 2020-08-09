/******************************************************************************
!Title : format GraphQL error
!Auth  : Anthony Pitts
!desc  : formats the graphQL errors propogated to leave the gateway server
******************************************************************************/

const formatGQLError = (err) => {
  try{
    //try to check for error that occured on the gateway
    var errMsg = JSON.parse(err.message)
    var errJSONUnformatted = errMsg.error
    var errJSONFormatted = errJSONUnformatted.split(': ').pop()  
    var newErr = new Error(errJSONFormatted)
    return { message: newErr.message }
  } catch (caughtErr){
    //error  from underlying microservice
    return { message: err.message }
  }
};


module.exports = { formatGQLError };
