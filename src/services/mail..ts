import nodemailer from 'nodemailer';

// Create transporter
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for 587
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
    },
});

/**
 * Send an email
 * @param to Recipient email
 * @param subject Email subject
 * @param text Email body
 */
export async function sendMail(to: string, subject: string, text: string) {
    try {
        const info = await transporter.sendMail({
            from: process.env.GMAIL_USER,
            to,
            subject,
            text,
        });
        console.log("Email sent: " + info.response);
        return info;
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
}
