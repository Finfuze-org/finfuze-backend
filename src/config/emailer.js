 require('dotenv').config()
 const { createTransport } = require('nodemailer');
const { CLIENT_RENEG_LIMIT } = require('tls');


// class SendMail {
//     transporter;
//     service;
//     host;
//     user;
//     pass;
//     from;
//     constructor(){
//         this.service = "gmail";
//         this.host = "smtp.gmail.com";
//         this.user = process.env.SMTP_USER;
//         this.pass = process.env.SMTP_PASS;
//         this.from = process.env.SMTP_ACCOUNT;
//     }

//     initiate(){
//         const transport = createTransport({
//             service: this.service,
//             host: this.host,
//             auth: {
//                 user: this.user,
//                 pass: this.pass
//             }
//         })
//         this.transporter = transport
//     }

//     async send_mail(
//         reciever, 
//         subject, 
//         message){
//             this.initiate()
//             try {
//                 const emailPayload = {
//                     from: this.from,
//                     to: reciever,
//                     subject,
//                     html: message
//                 }
//                 const mail = await this.transporter.sendMail(emailPayload);
//                 console.log("mail",mail)
//                 return;
//             } catch (error) {
//                 console.log("Error => ", error);
//                 throw error
//             }
//     }
// }


 

async function sendMail(email,subject,message) {
  const transporter = createTransport({
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMTP_USER,
      // pass: process.env.SMTP_PASS,
      // user: process.env.SERVICE_ACC_NAME,
      pass: process.env.SERVICE_PASSWORD,
    },
  });

  
  const info = await transporter.sendMail({  
    from: `${process.env.SMTP_ACCOUNT} <${process.env.SMTP_USER}>`,
    to: email,
    subject: subject,
    html: message,
  });
  // console.log(`info: ${info}`);
  // console.log(info)
}

module.exports = sendMail;
