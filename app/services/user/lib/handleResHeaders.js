const handleResHeaders = (apolloFetch, res) => {
    //get the response authorization header and put in this response
    apolloFetch.useAfter(({ response }, next) => {   
      if(response){
        var loginResponse = response.parsed;
        //if sucessful login
        if(loginResponse && loginResponse.data && loginResponse.data.getAuthTokensFromLogin ){

          //put the access token into this response header
          var accessToken = response.headers.get('Authorization');
          if(accessToken)
            res.append('Authorization', accessToken)

        }
      }
      next();
    });
    return apolloFetch
  };
  
  module.exports = { handleResHeaders };