const handleResHeaders = (apolloFetch) => {
    //get the response authorization header from login mutation
    //   and store in localStorage
    apolloFetch.useAfter(({ response }, next) => {   
      if(response){
        var parsedResponse = response.parsed;
        //if sucessful login
        if(parsedResponse && parsedResponse.data){
          //put the access token into the localStorage
          //var accessToken = response.headers.get('Authorization');
          //if(accessToken)
          //  localStorage.setItem('accessToken', accessToken)
          console.log('here on response FE');
          console.log(response.headers.get("Set-Cookie"))
          console.log(response.headers.get("set-cookie"))
        }
      }
      next();
    });
    return apolloFetch
  };
  
  module.exports = { handleResHeaders };