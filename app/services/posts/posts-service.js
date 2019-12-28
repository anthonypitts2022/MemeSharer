process.env.NODE_ENV = process.NODE_ENV || "development";
const rootPath = require("app-root-path");
require("module-alias/register");
const { logger } = require("@lib/logger.js");
const mongoose = require("./config/mongoose.js");
const express = require("./config/express.js");
const multer = require('multer');
const { createApolloFetch } = require('apollo-fetch');
const shortid = require("shortid");
var path = require('path');

const db = mongoose();
const app = express();
const port = process.env.PORT || 3301;



//============  Uploading images with posts   ====================//

app.route('/upload').post(function(req, res) {

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
       console.log(err)
       res.status(500).send({errors: err});
    }
    //if no file was provided/uploaded
    if(req.file==undefined){
      return res.status(200).send({errors: "Post must include a file. No file was provided."})
    }

    //if no errors on uploading file, proceed to create post

    //calls create post database mutation
    var fetch = createApolloFetch({
      uri: "http://localhost:3301/posts"
    });
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
            fileId
            fileType
            userId
            user{
              id
              name
              email
              profileUrl
            }
            id
            caption
            likeCount
            dislikeCount
            comments{
              text
              userId
              user{
                id
                name
                email
                profileUrl
              }
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
});


//=========================================================================//


//============  Serving files of posts   ====================//


app.route("/file/:fileId/:extension").get(function (req, res) {
  res.sendFile(req.params.fileId + req.params.extension, { root: "./uploads"});
});


//============================================================//


app.listen(port, () => logger.info(`posts service started on port ${port}`));
