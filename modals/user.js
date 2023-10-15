import mongoose from "mongoose";
import jwt from "jsonwebtoken";
const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true
    },
    email:{
        type: String,
        required:true
    },
    password:{
        type: String,
        required:true
    },
    address:{
        type: String,
        required:true
    },
    city:{
        type: String,
        required:true
    },
    State:{
        type: String,
        required:true
    },
    pinCode:{
        type: String,
        required:true
    },
    gender:{
        type: String,
        required:true
    },
    contactNumber:{
        type: String,
        required:true
    },
    likedBlogs:[
        {
            blogId:{
                type: mongoose.Schema.Types.ObjectId,
                ref:"Blogs"
            },
        }
    ]
});


UserSchema.methods.addblogIdToLikedBlogs = async function(userId){
    try {
        this.likedBlogs = this.likedBlogs.concat({userId});
        await this.save();
        return this.likedBlogs;
    } catch (error) {
        console.log(error)
    }
  }

UserSchema.methods.generateToken = function () {
    const payload = {
      id: this._id.toString(),
      name: this.name,
      password: this.password
    };
  
    // Sign a JWT with the payload and a secret key
    const token = jwt.sign(payload, process.env.SECRET_KEY);
  
    return token;
  };

const UserModal= mongoose.model('Users', UserSchema);
export default UserModal;
