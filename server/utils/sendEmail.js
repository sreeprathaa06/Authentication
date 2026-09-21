const transporter = require("../config/mailer");


// ======================================================
// SEND EMAIL
// ======================================================

const sendEmail = async ({ to, subject, html }) => {

    try {

        const mailOptions = {
            from: `"AuthForge Security" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html
        };

        const info = await transporter.sendMail(mailOptions);

        console.log("Email sent successfully ✅");
        console.log("Message ID:", info.messageId);

        return info;

    } catch (error) {

        console.error(
            "Email sending failed ❌",
            error.message
        );

        throw new Error("Unable to send email");
    }
};


module.exports = sendEmail;