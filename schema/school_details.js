const mongoose = require('mongoose');

const schoolDetailSchema = new mongoose.Schema({
  school_id: {
    type: String,
    required: true,
    unique: true 
  },
  name: {
    type: String,
    required: true
  },
  spoc_name: {
    type: String,
    required: true
  },
  spoc_id: {
    type: String,
    required: true,
    unique: true 
  },
  spoc_password: {
    type: String,
    required: true
  },
  spoc_contact: {
    type: String,
    required: true
  }
});

const SchoolDetail = mongoose.model('SchoolDetail', schoolDetailSchema, 'school_details');

module.exports = SchoolDetail;
