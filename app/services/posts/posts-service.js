const rootPath = require("app-root-path");
require("module-alias/register");
const { logger } = require("@lib/logger.js");
const mongoose = require("./config/mongoose.js");
const express = require("./config/express.js");
const multer = require('multer');
const { createApolloFetch } = require('apollo-fetch');
const shortid = require("shortid");
const { AuthenticateToken } = require('./lib/AuthenticateToken')
const { addReqHeaders } = require('./lib/addReqHeaders.js')
var path = require('path');

const db = mongoose();
const port = process.env.postsms_port

let app_info = express();

app_info.then(function(app_info){
  app = app_info[0] //app is the return from express
  server = app_info[1] //server is the return from https.createServer(credentials, app)



  //============  Uploading images with posts   ====================//

  app.route('/upload').post(function(req, res) {
    try{

      //Get the signed-in user's decrypted auth token payload
      const authTokenData = new AuthenticateToken(req);

      //'invalid user auth token or not signed in'
      if(authTokenData.errors) return res.status(200).send({errors: authTokenData.errors})

      //generates the image file id
      const fileId = shortid.generate();

      var storage = multer.diskStorage({
          destination: function (req, file, cb) {
            cb(null, "uploads")
          },
          filename: function (req, file, cb) {
            cb(null, fileId + path.extname(file.originalname) );
          }
      });

      var upload = multer({ storage: storage }).single('file');

      upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
           res.status(500).send({errors: err});
        } else if (err) {
           res.status(500).send({errors: err});
        }

        //if signed in user doesn't does match the userId being created with the post
        if(!authTokenData.hasMatchingUserID(req.body.userId)) 
          return res.status(200).send({errors: 'Signed in user does not match the user creating the post'})

        //if no file was provided/uploaded
        if(!req.file){
          return res.status(200).send({errors: "Post must include a file. No file was provided."})
        }
        //if unsupported file type was provided/uploaded
        let fileExtension = path.extname(req.file.originalname.toLowerCase())
        if(fileExtension!=".jpg" && fileExtension!=".png" && fileExtension!=".jpeg" && fileExtension!=".gif"){
          return res.status(200).send({errors: "Unsupported file type. (Must be .png, .jpg, .jpeg, or .gif)"})
        }

        //if no errors on uploading file, proceed to create post

        //calls create post database mutation
        var fetch = createApolloFetch({
          uri: `${process.env.ssl}://${process.env.website_name}:${process.env.gatewayms_port}/gateway`
        });

        //sets the authorization request header
        addReqHeaders(fetch, req.headers.authorization);
        //binds the res of upload to fetch to return the fetch data
        fetch = fetch.bind(res)

        fetch({
          query:
          `
            mutation createPost($input: createPostInput){
              Post: createPost(input: $input){
                errors{
                  msg
                }
              }
            }
          `,
          variables: {
            input: {
               caption : req.body.caption,
               userId : req.body.userId,
               fileId : fileId,
               fileType : path.extname(req.file.originalname)
             }
          }
      })
      .then(result => {
        //result.data holds the data returned from the createPost mutation
        return res.status(200).send(result.data.Post);
      })
      })
    }catch(err){
      //console.log(err);
    }
  });


  //=========================================================================//


  //============  Serving files of posts   ====================//


  app.route("/file/:fileId/:extension").get(function (req, res) {
    res.sendFile(req.params.fileId + req.params.extension, { root: "./uploads"});
  });


  //============================================================//


  server.listen(port, () => logger.info(`posts service started on port ${port}`));

})
