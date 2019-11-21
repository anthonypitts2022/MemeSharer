process.env.NODE_ENV = process.env.NODE_ENV || 'development'
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
    uri: "http://localhost:3302/user"
  });
  //binds the res of upload to fetch to return the fetch data
  fetch = fetch.bind(res)
  fetch({
    query:
    `
    query googleLogin($googleEmail: String!){
      user: googleLogin(googleEmail: $googleEmail){
      id
      errors{
        msg
      }
      }
    }
    `,
    variables: {
      input: {
        isLike: req.body.input.googleEmail,
      }
    }
  })
  .then(result => {
    //result.data holds the data returned from the mutation
    return res.status(200).send(result.data);
  })
});








app.listen(port, () => logger.info(`User service started on port ${port}`))
