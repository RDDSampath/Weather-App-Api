const express = require('express');
const cron = require('node-cron');
const bcrypt = require("bcryptjs");
const User = require('../models/User');
const router = express.Router();
const fetchWeatherData = require('../helper/fetchWeatherData');
const sendWeatherEmail = require('../helper/sendWeatherEmail');
//const getCityName = require('../helper/getCityName');


// Create user
router.post("/users", async (req, res) => {
  const { name, email, city, password, location } = req.body;
  const encryptedPassword = await bcrypt.hash(password, 10);

  try {
    const oldUser = await User.findOne({ email });
    if (oldUser) {
      return res.send({ error: "User Exists" });
    }
    const newUser = await User.create({
      name,
      email,
      //city: await getCityName(location.lat, location.lon),
      password: encryptedPassword,
      location
    });
    res.send({ status: "ok", userId: newUser._id, userName: newUser.name });
  } catch (error) {
    console.log(error);
    res.send({ status: "error", error: "Failed to create user" });
  }
});

// Update user location
router.put('/users/location/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { location } = req.body;
    const user = await User.findByIdAndUpdate(id, { location }, { new: true });

    if (!user) {
      return res.status(404).send('User not found');
    }

    // Remove the password from the user object
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    res.send(userWithoutPassword);
  } catch (error) {
    res.status(500).send('Error updating user location');
  }
});

// Get user weather data
router.get('/users/weather/:id', async (req, res) => {
  try {
      const { id } = req.params;
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).send('User not found');
      }
      const weatherData = await fetchWeatherData(user.location.lat, user.location.lon);
      res.send(weatherData);
    } catch (error) {
      res.status(404).send('User not found');
    }
});

// Send weather emails
async function sendWeatherEmails() {
  try {
    const users = await User.find();
    for (const user of users) {
      const weatherData = await fetchWeatherData(user.location.lat, user.location.lon);
      await sendWeatherEmail(user, weatherData);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  } catch (error) {
    console.error('Error during weather email process:', error);
  }
}

cron.schedule('1 */3 * * *', sendWeatherEmails);


module.exports = router;