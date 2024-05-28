const sgMail = require('@sendgrid/mail')
const apiKey = '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'

sgMail.setApiKey(apiKey)

const recipients = [
    { email: 'cr.mansilla@duocuc.cl', name: 'Cristian Mansilla' },
    { email: 'va.vidala@duocuc.cl', name: 'Valeria Vidal' },
    { email: 'die.ruminot@duocuc.cl', name: 'Diego Ruminot' },
    { email: 'ad.berrios@duocuc.cl', name: 'Adami Berrios' }
  ]

  recipients.forEach(recipient => {
    const msg = {
      to: recipient.email,
      from: 'ad.berrios@duocuc.cl',
      subject: 'Sending with SendGrid is Fun',
      text: `holaaa ${recipient.name}, está funcionando la api!`,
      html: `<strong>holaaa ${recipient.name}, está funcionando la api!</strong>`,
    }
  
    sgMail
      .send(msg)
      .then(() => {
        console.log(`Email sent to ${recipient.email}`)
      })
      .catch((error) => {
        console.error(`Error sending email to ${recipient.email}:`, error)
      })
  })