require('dotenv').configDotenv()
const { createTransport } = require('nodemailer')


class SendMail {
    transporter;
    service;
    host;
    user;
    pass;
    from;
    constructor(){
        this.service = "gmail";
        this.host = "smtp.gmail.com";
        this.user = process.env.SMTP_USER;
        this.pass = process.env.SMTP_PASS;
        this.from = process.env.SMTP_ACCOUNT;
    }

    initiate(){
        const transport = createTransport({
            service: this.service,
            host: this.host,
            auth: {
                user: this.user,
                pass: this.pass
            }
        })
        this.transporter = transport
    }

    async send_mail(
        reciever, 
        subject, 
        message){
            this.initiate()
            try {
                const emailPayload = {
                    from: this.from,
                    to: reciever,
                    subject,
                    html: message
                }
                await this.transporter.sendMail(emailPayload);
                return;
            } catch (error) {
                console.log("Error => ", error);
                throw error
            }
    }
}

module.exports = SendMail;
