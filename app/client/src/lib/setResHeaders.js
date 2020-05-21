
const setResHeaders = (apolloFetch) => {
    //get the response authorization header from login mutation
    //   and store in localStorage
    apolloFetch.useAfter(({ response }, next) => {   
      if(response){
        var loginResponse = response.parsed;
        //if sucessful login
        if(loginResponse && loginResponse.data && loginResponse.data.User && !loginResponse.data.User.errors){
          var authToken = response.headers.get('Authorization');
          if(authToken)
            localStorage.setItem('authToken', authToken)
        }
      }
      next();
    });
    return apolloFetch
  };
  
  module.exports = { setResHeaders };