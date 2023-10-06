import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
    title: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
  exp: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  downloadURL: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
});

const ApplicationModal = mongoose.model('Application', applicationSchema);

export default ApplicationModal;