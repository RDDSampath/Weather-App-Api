// sendWeatherEmail.js
const nodemailer = require('nodemailer');

const generateWeatherText = require('../helper/generateWeatherText');

async function sendWeatherEmail(user, weatherData) {
  // Generate the weather report text using OpenAI
  const weatherReportText = await generateWeatherText(weatherData);
  //const weatherReportText = "It's sunny today!";
  const WeatherEmail = weatherReportText.choices[0].text;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: user.email,
    subject: 'Your Weather Report',
    text: `Hello ${user.name},\n\nHere is your weather report:\n${WeatherEmail}`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Weather email sent to ${user.email}`);
  } catch (error) {
    console.error(`Failed to send weather email to ${user.email}:`, error);
  }
}

module.exports = sendWeatherEmail;
