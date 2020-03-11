const config = require("../config/config.js");
const axios = require("axios");

const sendMail = async (emailVars, route) => {
  let send = await axios.post(config.emailHost + route, emailVars);
};

module.exports = {
  sendMail
};
