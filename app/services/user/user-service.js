require('module-alias/register')
const rootPath = require('app-root-path')
const { logger } = require('@lib/logger.js')
const { createApolloFetch } = require('apollo-fetch');
const mongoose = require('./config/mongoose.js')
const express = require('./config/express.js')

const db = mongoose()
const port = process.env.userms_port

let app_info = express();

app_info.then(function(app_info){
  app = app_info[0] //app is the return from express
  server = app_info[1] //server is the return from https.createServer(credentials, app)


  //============  create or update user mutation call   ====================//

  app.route('/createupdateuser').post(function(req, res) {
    
    //calls database mutation
    var fetch = createApolloFetch({
      uri: `${process.env.ssl}://${process.env.website_name}:${process.env.gatewayms_port}/gateway`
    });
    //binds the res of upload to fetch to return the fetch data
    fetch = fetch.bind(res)
    fetch({
      query:
      `
      mutation createOrUpdateUser($input: CreateUserInput){
        User: createOrUpdateUser(input: $input){
          errors{
            msg
          }
          id
          name
          email
          profileUrl
        }
      }
      `,
      variables: {
        input: {
          id: req.body.input.id,
          email: req.body.input.email,
          name: req.body.input.name,
          profileUrl: req.body.input.profileUrl
        }
      }
    })
    .then(result => {
      //result.data holds the data returned from the mutation
      return res.status(200).send(result.data);
    })
  });



  server.listen(port, () => logger.info(`User service started on port ${port}`))

})
