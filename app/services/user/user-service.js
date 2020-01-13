process.env.NODE_ENV = require('./config/env/environment.js') || 'development'
require('module-alias/register')
const rootPath = require('app-root-path')
const { logger } = require('@lib/logger.js')
const { createApolloFetch } = require('apollo-fetch');
const mongoose = require('./config/mongoose.js')
const express = require('./config/express.js')

const db = mongoose()
const app = express()
const port = process.env.PORT || 3002


//============  login user mutation call   ====================//

app.route('/login').post(function(req, res) {
  //calls database mutation
  var fetch = createApolloFetch({
    uri: "http://localhost:3002/user"
  });
  //binds the res of upload to fetch to return the fetch data
  fetch = fetch.bind(res)
  fetch({
    query:
    `
    query googleLogin($googleEmail: String!){
      user: googleLogin(googleEmail: $googleEmail){
      email
      errors{
        msg
      }
      }
    }
    `,
    variables: {
      googleEmail: req.body.input.googleEmail,
    }
  })
  .then(result => {
    //result.data holds the data returned from the mutation
    return res.status(200).send(result.data);
  })
});


//============  create or update user mutation call   ====================//

app.route('/createupdateuser').post(function(req, res) {
  //calls database mutation
  var fetch = createApolloFetch({
    uri: "http://localhost:3002/user"
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








app.listen(port, () => logger.info(`User service started on port ${port}`))
