import mongoose from 'mongoose';

const category = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  }
});

const CategoryModal = mongoose.model('Category', category);

export default CategoryModal;