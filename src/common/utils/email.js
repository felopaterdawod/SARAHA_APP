import nodemailer from "nodemailer";
import { OTP_EMAIL, OTP_PASS } from "../../../config/config.service.js";

export const sendEmail = async (to ,otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: OTP_EMAIL,
      pass: OTP_PASS,
    },
  });

  await transporter.sendMail({
    from: "Saraha App",
    to,
    subject: "OTP 🔐 Saraha App Verification Code",
    text: `
Hi 👋

Welcome to Saraha App!

Your OTP is: ${otp}

It expires in 5 minutes.

Ignore this email if you didn't sign up.

<<<<<<< HEAD
Made with ❤️ by Felopater Dawoud
=======
Made with ❤️ by Felopateer Dawoud
>>>>>>> f75e7dc87777f915c3dec3a563d30c688d626ac0
`,
});
};
