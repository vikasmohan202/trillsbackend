require("dotenv").config();
const twilio_client = require("twilio")(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH_TOKEN
);
const sendOTP=async (userID=null) => {
   let digits = "1234567890";
   let otp = "";
   for (let i = 0; i < 4; i++) {
     otp += digits[Math.floor(Math.random() * 10)];
   }

  //  const user = await User.findOneAndUpdate({
  //    otp: otp,
  //  });

 twilio_client.messages
   .create({
    body:`your otp for login is ${otp}`,
     from: "+19287935351",
     to: "+917004177568",
   })
   .then((message) => console.log(message.sid))
   .done();
};
module.exports = {
  sendOTP
};
