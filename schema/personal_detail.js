const mongoose = require('mongoose');

const personalDetailSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phone_no: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  }
});

const PersonalDetail = mongoose.model('PersonalDetail', personalDetailSchema, 'personal_details');

module.exports = PersonalDetail;
