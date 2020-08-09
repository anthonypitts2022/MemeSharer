
const cookieToReqHeader = (request, cookieName, cookieContent) => {
  request.http.headers.set(cookieName, cookieContent)

  var prevAllowedHeaders = request.http.headers.get("Access-Control-Allow-Headers")
  if(prevAllowedHeaders)
    var allowedHeaders = `${prevAllowedHeaders}, ${cookieName}`
  else
    var allowedHeaders = cookieName
    
  request.http.headers.set("Access-Control-Allow-Headers", allowedHeaders)

  };
  
  module.exports = { cookieToReqHeader };