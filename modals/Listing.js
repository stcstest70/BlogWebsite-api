import mongoose from 'mongoose';

// Define the schema
const dataSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
  tags: {
    type: String,
    required: true,
  },
  skills: {
    type: String,
    required: true,
  },
  experience: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  salary: {
    type: String,
    required: true,
  },
  keyValues: [
    {
      key: {
        type: String,
        required: true,
      },
      value: {
        type: String,
        required: true,
      },
    },
  ],
});

// Create a model based on the schema
const ListingModal = mongoose.model('Listing', dataSchema);

export default ListingModal;