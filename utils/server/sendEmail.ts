import nodemailer from 'nodemailer'
import { google } from 'googleapis'
import Mail from 'nodemailer/lib/mailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport'

const clientId = process.env.EMAIL_CLIENT_ID
const clientSecret = process.env.EMAIL_CLIENT_SECRET
const redirectUri = process.env.EMAIL_REDIRECT_URI
const refreshToken = process.env.EMAIL_REFRESH_TOKEN

const oAuth2Client = new google.auth.OAuth2({ clientId, clientSecret, redirectUri })

oAuth2Client.setCredentials({ refresh_token: refreshToken })

export const sendEmail = async (mailOptions: Mail.Options) => {
  try {
    const { token: accessToken } = await oAuth2Client.getAccessToken()

    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'bordobereli435@gmail.com',
        clientId,
        clientSecret,
        refreshToken,
        accessToken,
      },
    } as SMTPTransport.Options)

    mailOptions.from = 'Kudret Davudov <bordobereli435@gmail.com>'

    const result = await transport.sendMail(mailOptions)

    return result
  } catch (err) {
    return err
  }
}
