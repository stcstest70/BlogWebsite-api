import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    }
  });

const CategoryModal = mongoose.model('Category', categorySchema);

export default CategoryModal;