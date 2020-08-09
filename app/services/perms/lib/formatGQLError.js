/******************************************************************************
!Title : format GraphQL error
!Auth  : Anthony Pitts
!desc  : formats the graphQL errors propogated to leave the server
******************************************************************************/

const formatGQLError = (err) => {
  try{
    var errMsg = JSON.parse(err.message)
    var errJSONUnformatted = errMsg.error
    var errJSONFormatted = errJSONUnformatted.split(': ').pop()    
    return new Error(errJSONFormatted)
  } catch (err){
    return err
  }
};


module.exports = { formatGQLError };
