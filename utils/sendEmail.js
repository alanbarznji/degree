const nodemailer = require("nodemailer");
const SendEmail = async (get) => {
  const transport = nodemailer.createTransport({
    service: "gmail",
    host: process.env.PROCESS_HOST,
    port: process.env.PROCESS_PORT,
    secure: true,
    requireTLS: true,
    auth: {
      user: process.env.PROCESS_EMAIL,
      pass: process.env.PROCESS_PASSWORD,
    },
    tls: {
      // do not fail on invalid certs
      rejectUnauthorized: false,
    },
  });
  const mailOpts ={
    from: "degrees <alanbarznji91@gmail.com>",
    to: get.email,
    subject: get.subject,
    text: get.message,
  };
  
  const info= await transport.sendMail(mailOpts,(error, info) => {
  if (error) {
    console.error('Error sending email:', error);
  } else {
    console.log('Email sent successfully:', info);
  }
}) 
console.log(info);
console.log(mailOpts.to,"kaka"); 
};
module.exports = SendEmail;
 