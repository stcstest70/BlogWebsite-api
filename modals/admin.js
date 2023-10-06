import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const AdminModal = mongoose.model('Admin', adminSchema);

export default AdminModal;