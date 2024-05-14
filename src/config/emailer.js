 require('dotenv').config()
 const { createTransport } = require('nodemailer');
const { CLIENT_RENEG_LIMIT } = require('tls');



const transport = createTransport({
  service: process.env.SMTP_SERVICE,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SERVICE_PASSWORD,
  },
})



const sender = async function(email, subject, message) {
  await transport.sendMail({
    from: `${process.env.SMTP_ACCOUNT} <${process.env.SMTP_USER}>`,
    to: email,
    subject: subject,
    html: message,
  })
}



module.exports = sender;




