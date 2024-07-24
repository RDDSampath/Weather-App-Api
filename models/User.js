const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    city: { type: String },
    password: { type: String, required: true },
    location: { 
        lat: { type: Number, required: true },
        lon: { type: Number, required: true },
    },
    weatherData: { type: Object }
});

module.exports = mongoose.model('User', userSchema);