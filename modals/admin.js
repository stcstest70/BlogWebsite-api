import mongoose from 'mongoose';
import jwt from 'jsonwebtoken'

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

adminSchema.methods.generateToken = function () {
  const payload = {
    id: this._id.toString(),
    name: this.name,
    password: this.password
  };

  // Sign a JWT with the payload and a secret key
  const token = jwt.sign(payload, process.env.SECRET_KEY);

  return token;
};

const AdminModal = mongoose.model('Admin', adminSchema);

export default AdminModal;