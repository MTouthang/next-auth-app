import nodemailer from 'nodemailer'
import Customer from "@/models/userModel"
import bcryptjs from 'bcryptjs'

export const sendEmail = async ({email, emailType, userId }: any) => {
  try {
    // create a hash token
    console.log("email initiated")
    const hashToken = await bcryptjs.hash(userId.toString(), 10)

    if(emailType === "VERIFY") {
      await Customer.findByIdAndUpdate(userId, {
        verifyToken: hashToken, verifyTokenExpiry: Date.now() + 3600000,
      })
    } else if (emailType === "RESET") {
      await Customer.findByIdAndUpdate( userId, {
        forgotPasswordToken:hashToken,
        forgotPasswordTokenExpiry: Date.now() + 3600000
      })
    }
    // create nodemailer 
    var transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    });

    const mailOptions = {
      from: "mang@gmail.com",
      to: email,
      subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
      html : 
      `<p> Click 
      <a href="${process.env.domain}/verifyemail?token=${hashToken}"> Here  </a> to
      ${emailType === "VERIFY" ? "verify your email" : "reset your password"}
      or copy and paste the link below in your browser <br>
      ${process.env.domain}/verifyemail?token=${hashToken}
      </p>`
    }

    const mailResponse = await transport.sendMail(mailOptions) 
    console.log("email send !")
    return mailResponse
  } catch ( error: any) {
      throw new Error(error.message)
  }
}