const { RemoteGraphQLDataSource } = require("@apollo/gateway");

//handles transfering req/res objects between microservices and the gateway 
class GatewayMicroServiceDataTransfer extends RemoteGraphQLDataSource {

  //sets the authorization header from underlying microservice's response
  //   into the gateway context, which will be used when sending out
  //   final response
  didReceiveResponse({ response, request, context }) {
    //response object is the response from the underyling microservices
    var resAuthToken = response.http.headers.get('Authorization');
    if(resAuthToken)
      context.resAuthToken = resAuthToken;

    return response;
  }

  // Pass the Authorization header from the gateway request to underlying microservices
  willSendRequest({ response, request, context }) {
    request.http.headers.set('Authorization', context.reqAuthToken);
    request.http.headers.set('Access-Control-Allow-Headers', 'Authorization');
  }

}

module.exports = { GatewayMicroServiceDataTransfer };
