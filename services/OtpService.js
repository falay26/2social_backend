const axios = require("axios");

const OtpService = async (phone, message) => {
  axios({
    method: "post",
    url: "https://api.netgsm.com.tr/sms/send/otp",
    headers: { "Content-Type": "application/xml" },
    data:
      '<?xml version="1.0"?>\r\n<mainbody>\r\n   <header>\r\n       <usercode>8503039871</usercode>\r\n       <password>P1-1QVP4</password>\r\n       <msgheader>8503039871</msgheader>\r\n       <appkey></appkey> \r\n   </header>\r\n   <body>\r\n       <msg>\r\n           <![CDATA[' +
      message +
      "]]>\r\n       </msg>\r\n       <no>" +
      phone +
      "</no>\r\n   </body>\r\n</mainbody>",
  })
    .then(function (response) {
      console.log(response);
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = OtpService;
