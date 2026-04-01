//dependencies
const https = require("node:https");
const queryString = require("node:querystring");
const { twilio } = require("./environments");

//module object-scaffolding
const notification = {};

//send sms to user using twilio api
notification.sendTwilioSms = (phone, sms, callBack) => {
  //input validation
  const phone =
    typeof phone === "string" && phone.trim().length === 11
      ? phone.trim()
      : false;

  const userMsg =
    typeof msg === "string" &&
    msg.trim().length > 0 &&
    msg.trim().length <= 1600
      ? msg.trim()
      : false;
  if (phone && userMsg) {
    //configure the request payload
    const payLoad = {
      From: twilio.fromPhone,
      To: `+88${phone}`,
      Body: msg,
    };
    //stringify the payload
  } else {
    callBack("given parameters are missing");
  }
};

module.exports = notification;
