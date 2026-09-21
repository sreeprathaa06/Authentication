const nodemailer = require("nodemailer");
console.log("EMAIL_HOST:", process.env.EMAIL_HOST);
console.log("EMAIL_PORT:", process.env.EMAIL_PORT);
console.log("EMAIL_USER:", process.env.EMAIL_USER ? "LOADED" : "MISSING");
console.log("EMAIL_PASSWORD:", process.env.EMAIL_PASSWORD ? "LOADED" : "MISSING");
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: Number(process.env.EMAIL_PORT) === 465,

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

transporter.verify((error, success) => {
    if (error) {
        console.error("Email transporter error ❌");
        console.error(error.message);
    } else {
        console.log("Email transporter ready successfully ✅");
    }
});

module.exports = transporter;