
const setCookie = (context, cookieName, cookieContent) => {

    var secureCookie = false
    if(process.env.NODE_ENV=="production")
      secureCookie = true 

    context.res.cookie(cookieName, cookieContent, {
      httpOnly: true,
      secure: secureCookie,
      maxAge: 100000000000 //without this long duration, 
                          // cookie will be removed when browser is closed
    })
    context.res.set("Access-Control-Expose-Headers","Set-Cookie")

  };
  
  module.exports = { setCookie };