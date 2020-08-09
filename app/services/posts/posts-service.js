const rootPath = require("app-root-path");
require("module-alias/register");
const { logger } = require("@lib/logger.js");
const mongoose = require("./config/mongoose.js");
const express = require("./config/express.js");
const multer = require('multer');
const shortid = require("shortid");
const { AuthenticateAccessToken } = require('./lib/AuthenticateAccessToken')
const { createPost } = require('./APIFetches/createPost.js')
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
      //put incoming accesstoken cookie into the req.header
      var headers = req.headers
      if(headers && req.cookies.accesstoken)
        headers["accesstoken"] = req.cookies.accesstoken
        headers["Access-Control-Allow-Headers"] = "accesstoken"
      req.headers = headers

      //Get the signed-in user's decrypted auth token payload
      const accessTokenData = new AuthenticateAccessToken(req);


      //'invalid user auth token or not signed in'
      if(accessTokenData.errors) return res.status(200).send({errors: accessTokenData.errors})

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
      
      upload(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
           res.status(500).send({errors: err});
        } else if (err) {
           res.status(500).send({errors: err});
        }
        //if signed in user doesn't does match the userId being created with the post        
        if(!accessTokenData.hasMatchingUserID(req.body.userId)){
          return res.status(200).send({errors: 'Signed in user does not match the user creating the post'})
        }
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
        var createPostResult = await createPost({
          input: {
             caption : req.body.caption,
             userId : req.body.userId,
             fileId : fileId,
             fileType : path.extname(req.file.originalname)
           }
        }, req.headers.accesstoken)
          
        //createPostResult.data holds the data returned from the createPost mutation
        res.set("Access-Control-Allow-Origin", `${process.env.ssl}://${process.env.website_name}:${process.env.client_port}`)
        return res.status(200).send(createPostResult.data.Post);
      })

    }catch(err){
      console.log(err);
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
