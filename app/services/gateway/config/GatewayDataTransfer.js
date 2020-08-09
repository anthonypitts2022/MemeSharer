const { RemoteGraphQLDataSource } = require("@apollo/gateway");
const { setCookie } = require("../lib/setCookie");
const { cookieToReqHeader } = require("../lib/cookieToReqHeader");

var tokens = ['accesstoken', 'refreshtoken', 'refreshtokensecret']

//handles transfering req/res objects between microservices and the gateway 
class GatewayMicroServiceDataTransfer extends RemoteGraphQLDataSource {

  
  didReceiveResponse({ response, request, context }) {
    //response object is the response from the underyling microservices
    for(var i=0; i<tokens.length; i++){
      var token = response.http.headers.get(tokens[i]);
      if(token)
        //sets the authorization header from underlying microservice's response
        //   into the gateway context, which will be used when sending out
        //   final response
        setCookie(context, tokens[i], token)
    }
    
    return response;
  }


  willSendRequest({ response, request, context }) {
    if(context && context.req && context.req.cookies){
      for(var i=0; i<tokens.length; i++){
        var token = context.req.cookies[tokens[i]];  
        if(token)
          //Pass incoming cookie into request header to underlying microservice
          cookieToReqHeader(request, tokens[i], token)
      }

    }
  }

}

module.exports = { GatewayMicroServiceDataTransfer };
