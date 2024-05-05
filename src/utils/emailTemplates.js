const sender = require('../config/emailer');

const optMessage = async function(email, otpCode) {
    const subject = "OTP VERIFICATION";
    const message = `<p>Please enter ${otpCode} to verify email and complete sign up.</p>
    <p>This code <b>expires in 30 minutes.</b></p> 
     <p>Press <a href="${process.env.CLIENT_URL}">here</a> to proceed.</p>                                                               
     `;
    await sender(email, subject, message);
    console.log('sent');
  }
  
  module.exports = {
    optMessage,
  }