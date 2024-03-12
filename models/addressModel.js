const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  name: String,
  mobileNumber: Number,
  pincode: Number,
  locality: String,
  city: String,
  landmark: String,
  state: String,
  alternateNumber: Number,
  fullAddress: String,
});

module.exports = addressSchema;
