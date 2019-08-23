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
        cb(null, fileId + path.extname(file.originalname) )
      }
  });

  var upload = multer({ storage: storage }).single('file');


  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
       return res.status(500).json(err)
    } else if (err) {
       console.log(err)
       return res.status(500).json(err)
    }
    //calls create post database mutation
    const fetch = createApolloFetch({
      uri: "http://localhost:3301/posts"
    });

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
            id
            caption
            likeCount
            dislikeCount
            comments{
              text
              userId
            }
          }
        }
      `,
      variables: {
        input: {
           caption : req.body.caption,
           fileId : fileId,
           fileType : path.extname(req.file.originalname)
         }
      }
    })
    .then(res => {
      //res.data holds the data returned from the createPost mutation
      //console.log(res.data);
    })

    //return a good 200 status with the file
    return res.status(200).send(req.file)
  })

});

//=========================================================================//

//============  Serving files of posts   ====================//


app.route("/file/:fileId/:extension").get(function (req, res) {
  res.sendFile(req.params.fileId + req.params.extension, { root: "./uploads"});
});


//============================================================//


app.listen(port, () => logger.info(`posts service started on port ${port}`));
