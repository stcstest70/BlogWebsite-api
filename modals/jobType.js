import mongoose from 'mongoose';

const type = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
});

const TypeModal = mongoose.model('Type', type);

export default TypeModal;