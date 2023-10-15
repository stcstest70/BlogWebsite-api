import jwt, { decode } from "jsonwebtoken";
import AdminModal from "../modals/admin.js";
import UserModal from "../modals/user.js";
import BlogModal from "../modals/blogs.js";
import bcrypt from 'bcrypt';
const saltRounds = 10;
import sendEmail from "../utils/sendEmail.js";
import CategoryModal from "../modals/category.js";

export async function adminLogin(req, res) {
    try {
      const name = req.body.name;
      const password = req.body.password;
  
      if (!name || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
      }
  
      // Find the admin user by name
      const user = await AdminModal.findOne({ name });
  
      if (user) {
        // Compare the entered password with the stored hashed password
        bcrypt.compare(password, user.password, (compareError, isMatch) => {
          if (compareError || !isMatch) {
            res.status(401).json({ message: 'Invalid user name or password' });
          } else {
            // Passwords match, generate a token and send it
            const token = user.generateToken();
            res.status(201).json({ message: 'Admin logged in Successfully', token });
          }
        });
      } else {
        res.status(401).json({ message: 'Invalid user name or password' });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Error in server side' });
    }
  }

  export async function candidateLogin(req, res){
    try {
      const email = req.body.name;
      const password = req.body.password;
      if (!email || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
      }
      const user = await UserModal.findOne({ email: email });
      if (user) {
        // Compare the entered password with the stored hashed password
        bcrypt.compare(password, user.password, (compareError, isMatch) => {
          if (compareError || !isMatch) {
            res.status(401).json({ message: 'Invalid user name or password' });
          } else {
            const token = user.generateToken();
            res.status(201).json({ message: 'User logged in Successfully', token });
          }
        });
      }
      else{
        res.status(401).json({ message: 'Invalid user name or password'});
      }
    } catch (error) {
        console.log(error);
      res.status(500).json({ error: 'Error in server side ' });
    }
  }

 export async function checkAdminTokenValid(req, res){
    const {token} = req.body;
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        if(decoded){
          res.status(200).json({ message: 'Token is valid', decoded });
        }
        
      } catch (error) {
        res.status(401).json({ message: 'Token is invalid' });
      }
    
}

export async function checkUserTokenValid(req, res){
    const {token} = req.body;
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        if(decoded){
          res.status(200).json({ message: 'Token is valid', decoded });
        }
        
      } catch (error) {
        res.status(401).json({ message: 'Token is invalid' });
      }
    
}

export async function getUserdataByToken(req, res) {
  const { token } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (decoded) {
      const userId = decoded.id;
      const user = await UserModal.findById(userId).populate('likedBlogs.blogId');
      // console.log(user)
      res.status(200).json({ message: 'Token is valid', user });
    }
  } catch (error) {
    res.status(401).json({ message: 'Token is invalid' });
  }
}

export async function getAllBlogs(req, res){
    try {
      const data = await BlogModal.find().populate('category');
      res.send(data);
    } catch (error) {
      console.log(error);
    }
  }
export async function getAllCategory(req, res){
    try {
      const data = await CategoryModal.find().collation({ locale: 'en', strength: 2 }).sort({ name: 1 });
      res.send(data);
    } catch (error) {
      console.log(error);
    }
  }

  export async function getTotalBlogs(req, res) {
    try {
      const searchString = req.query.searchString;
      const category = req.query.selectedCategory;
  
      if (category) {
        // If category is provided, get the count of blogs with that category
        const totalBlogs = await BlogModal.countDocuments({ category });
        res.json(totalBlogs);
      } else if (searchString) {
        // If searchString is provided, perform a search by title to get the count
        const totalBlogs = await BlogModal.countDocuments({
          title: { $regex: new RegExp(searchString, 'i') },
        });
        res.json(totalBlogs);
      } else {
        // If neither category nor searchString is provided, get the total count of all blogs
        const totalBlogs = await BlogModal.countDocuments();
        res.json(totalBlogs);
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  export async function register(req, res){

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const address = req.body.address;
    const city = req.body.city;
    const State = req.body.State;
    const pinCode = req.body.pinCode;
    const gender = req.body.gender;
    const contactNumber = req.body.contactNumber;
    

    const validateEmail = (email) => {
      // Regular expression for email validation
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      return emailRegex.test(email);
    };
    
    const validatePinCode = (pinCode) => {
      // Regular expression for pin code validation (assuming 6-digit numeric pin code)
      const pinCodeRegex = /^\d{6}$/;
      return pinCodeRegex.test(pinCode);
    };
    
    const validateContactNumber = (contactNumber) => {
      // Regular expression for contact number validation (assuming 10-digit numeric contact number)
      const contactNumberRegex = /^\d{10}$/;
      return contactNumberRegex.test(contactNumber);
    };
    
    const validatePassword = (password) => {
      // Password must be at least 6 characters long
      return password.length >= 6;
    };

    if (!validateEmail(email) || !validatePinCode(pinCode) || !validateContactNumber(contactNumber) || !validatePassword(password)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    try {
      let userExist = await UserModal.findOne({ email: email });

      if (userExist) {
          return res.status(422).json({ error: "Email already exist" });
      }
      else {
        bcrypt.hash(password, saltRounds, (err, hash) => {
            if (err) {
              console.error('Error hashing password:', err);
              return res.status(500).send('Password hashing failed.');
            }
            const newUser = new UserModal({
                name,
                email,
                password: hash,
                address,
                city,
                State,
                pinCode,
                gender,
                contactNumber
              });
          
    
              newUser.save();
            //   await sendEmail(user.email, "User Registered Successfully", `User Registration successful. Your user id is ${email}, and password is ${password}`);
              res.status(201).json({ message: "User Registered Successfully" });

        });
      
      }
  } catch (error) {
      console.log(error);
  }

  }

  export async function getBlogs(req, res) {
    try {
      const page = parseInt(req.query.page) || 1; // Get the requested page (default to page 1)
      const perPage = parseInt(req.query.perPage) || 4; // Number of blogs per page (default to 4)
      const searchString = req.query.searchString;
      const category = req.query.selectedCategory;
      const skip = (page - 1) * perPage;
  
      let query = {}; // Define an empty query object
  
      if (searchString) {
        // If searchString is provided, perform a search by title
        query.title = { $regex: new RegExp(searchString, 'i') };
      }
  
      if (category) {
        // If category is provided, filter by category
        query.category = category;
      }
  
      const data = await BlogModal.find(query)
        .collation({ locale: 'en', strength: 2 })
        .sort({ title: 1 })
        .skip(skip)
        .limit(perPage).populate('category');
  
      res.json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  export async function getBlogsById(req, res) {
    try {
      const page = parseInt(req.query.page) || 1; // Get the requested page (default to page 1)
      const perPage = parseInt(req.query.perPage) || 4; // Number of blogs per page (default to 4)
      const sortBy = req.query.sortBy;
      // console.log('Sorting by ', sortBy);
  
      // Calculate the skip value to skip the appropriate number of blogs
      const skip = (page - 1) * perPage;
  
      // Fetch and send the data based on pagination parameters
      const sortObject = {};
    sortObject[sortBy] = 1; 
      const data = await BlogModal.find()
        .collation({ locale: 'en', strength: 2 })
        .sort(sortObject) 
        .skip(skip)
        .limit(perPage).populate('category');
  
      res.json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  export async function getBlogByCategory(req, res){
    const category = req.query.category;
    const perPage =parseInt(req.query.perPage) || 10;
    const blog = await BlogModal.find({ category }).limit(perPage);
    res.json(blog);
  }
  export async function getBlogById(req, res){
    const id = req.query.id;
    const blog = await BlogModal.findById(id).populate('category');
    res.json(blog);
  }

  export async function addBlog(req, res){
    const name = req.body.userName;
    const title = req.body.title;
    const blog = req.body.blog;
    const category = req.body.selectedOption;
    const image = req.body.image;
    if(!name || !title || !blog || !category || !image){
        return res.status(400).json({ error: 'All fields required' });
    }
    const newBlog = new BlogModal({
        name, title, blog, category, image
    })
    await newBlog.save();
    return res.status(201).json({ error: 'New Blog Added' });
}
  export async function addCategory(req, res){
    const name = req.body.userName;
    const category = req.body.category;
    if(!name || !category){
        return res.status(400).json({ error: 'All fields required' });
    }
    const newBlog = new CategoryModal({
        name,category
    })
    await newBlog.save();
    return res.status(201).json({ error: 'New Category Added' });
}

export async function editCategory(req, res){
    try {
        const id = req.body.catid; 
        const name = req.body.editName;
        const category = req.body.cat_edit;
    
        // console.log(id, name, title, blog);
        if (!id || !name || !category) {
          return res.status(400).json({ error: 'All fields required' });
        }
    
        // Find the blog by ID and update it
        const result = await CategoryModal.updateOne({ _id: id }, { name, category });
    
        
          return res.status(201).json({ message: 'Category updated successfully' });
        
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error in server side' });
      }
}
export async function editBlog(req, res){
    try {
        const id = req.body.blogid; 
        const name = req.body.editName;
        const title = req.body.title_edit;
        const blog = req.body.blog_edit;
        const category = req.body.selectedOption2;
        const image = req.body.newImg;
    
        // console.log(id, name, title, blog);
        if (!id || !name || !title || !blog || !category || !image) {
          return res.status(400).json({ error: 'All fields required' });
        }
    
        // Find the blog by ID and update it
        const result = await BlogModal.updateOne({ _id: id }, { name, title, blog, category, image });
    
        
          return res.status(201).json({ message: 'Blog updated successfully' });
        
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error in server side' });
      }
}

export async function deleteCategory(req, res){
    try {
        const id = req.body.delId; 
    
        // console.log(id, name, title, blog);
        if (!id) {
          return res.status(400).json({ error: 'All fields required' });
        }
    
        // Find the blog by ID and update it
       await CategoryModal.deleteOne({ _id: id });

   
      return res.status(201).json({ message: 'Blog deleted successfully' });
   
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error in server side' });
      }
}
export async function deleteBlog(req, res){
    try {
        const id = req.body.delId; 
    
        // console.log(id, name, title, blog);
        if (!id) {
          return res.status(400).json({ error: 'All fields required' });
        }
    
        // Find the blog by ID and update it
       await BlogModal.deleteOne({ _id: id });

   
      return res.status(201).json({ message: 'Blog deleted successfully' });
    
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error in server side' });
      }
}

export async function searchBlogs(req, res) {
    try {
      const searchQuery = req.query.query; 
      const results = await BlogModal.find({
        $or: [
        //   { name: { $regex: new RegExp(searchQuery, 'i') } },
          { title: { $regex: new RegExp(searchQuery, 'i') } },
        //   { blog: { $regex: new RegExp(searchQuery, 'i') } },
        ],
      });
  
      res.json(results);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  // router.get('/api/data', async (req, res) => {
//     const page = req.query.page || 1; // Get the current page from the query parameters
//     const perPage = 10; // Number of records per page
//     const skip = (page - 1) * perPage;
  
//     try {
//       const data = await AllProductModel.find().skip(skip).limit(perPage);
//       res.json(data);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Server Error' });
//     }
//   });


//Adding an admin data from server

// const adminPassword = 'admin';
// bcrypt.hash(adminPassword, saltRounds, (err, hash) => {
//   if (err) {
//     console.error('Error hashing admin password:', err);
//     return;
//   }

//   // Create a new admin user and save it to the database
//   const newAdmin = new AdminModal({
//     name: 'admin',
//     password: hash, // Store the hashed password
//   });

//   newAdmin.save();
// });

export async function forgotPassword(req, res){
  try {
    const email = req.body.name;
    const currentPageURL = req.body.currentPageURL;
    if(!email || !currentPageURL){
      return res.status(400).json({message : 'Enter all fields'})
    }
    const user = await UserModal.findOne({email : email});
    if(user){
        const url = `${currentPageURL}/users/${user.id}/resetPassword`;
        await sendEmail(user.email, "Reset Password Link", url);
        return res.status(201).json({ message: "An email sent, please verify" });
    }
    else {
      return res.status(401).json({ error: "Email not registered" });
  }
    
  } catch (error) {
    console.log(error);
  }
}

export async function resetPassword(req, res) {
  const id = req.body.id;
  const password = req.body.password;

  if (!id || !password) {
    return res.status(400).json({ message: 'Enter all fields' });
  }

  try {
    // Hash the new password
    bcrypt.hash(password, saltRounds, async (err, hash) => {
      if (err) {
        console.error('Error hashing password:', err);
        return res.status(500).send('Password hashing failed.');
      }

      // Update the user's password with the hashed password
      await UserModal.findOneAndUpdate({ _id: id }, { $set: { password: hash } });

      return res.status(201).json({ message: 'Password Updated Successfully' });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error in server side' });
  }
}

export async function userLiked(req, res){
  const id = req.query.id;
  const blog = await BlogModal.findById(id);
  blog.likes += 1;
    await blog.save();
}
export async function userDisLiked(req, res){
  const id = req.query.id;
  const blog = await BlogModal.findById(id);
  blog.likes -= 1;
    await blog.save();
}

export async function getLikes(req, res) {
  const id = req.query.id;
  const userId = req.query.userId;

  try {
    // Find the blog by id
    const blog = await BlogModal.findById(id);

    if (!blog) {
      return res.status(404).json({ error: 'Blog not found.' });
    }

    // Check if the user has already liked the blog
    const alreadyLiked = blog.likes.some((like) => like.userId.equals(userId));

    const likesCount = blog.likes.length;

    // Check if the user has already liked the blog and send the liked status
    res.json({ likesCount, liked: alreadyLiked });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}
// export async function setLikes(req, res) {
//   const id = req.query.id;
//   const liked = req.query.isLike;
//   const userId = req.query.userId;
//   try {
//     const blog = await BlogModal.findById(id);

//     if (!blog) {
//       return res.status(404).json({ error: 'Blog not found.' });
//     }

//     if (liked === 'like') {
//       blog.likes += 1;
//       await blog.save();



//       res.json({ message: 'Liked successfully', likes: blog.likes });
//     }
//     else if(liked === 'unlike'){
//       blog.likes -= 1;
//       await blog.save();

//       res.json({ message: 'Liked successfully', likes: blog.likes });
//     } else {
//       res.status(400).json({ error: 'Invalid action.' });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Server error' });
//   }
// }

export async function setLikes(req, res) {
  const id = req.query.id;
  const userId = req.query.userId;
  if(!id || !userId){
    return res.status(404).json({ error: 'Blog not found.' });
  }
  else{
     try {
    const blog = await BlogModal.findById(id);

    if (!blog) {
      return res.status(404).json({ error: 'Blog not found.' });
    }
    const user = await UserModal.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Check if the user has already liked the blog
    const alreadyLiked = blog.likes.some((like) => like.userId.equals(userId));
    
    if (!alreadyLiked) {
      blog.likes = [...blog.likes, { userId }];

      user.likedBlogs = [...user.likedBlogs, { blogId: id }];
    
      await blog.save();
      await user.save();

    res.status(201).json({ message: 'Liked successfully', likes: blog.likes.length });
    } else {
      console.log('User already liked this blog');
      return res.status(400).json({ error: 'User has already liked this blog.' });
    }

    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
  }
 
}

export async function postComment(req, res){
  const userId = req.body.userId;
  const blogId = req.body.blogId;
  const title = req.body.commentTitle;
  const comment = req.body.commentDescription;
  // console.log(userId, blogId, title, comment);
  if(!userId || !blogId || !title || !comment){
    return res.status(400).json({message : 'All fields requires'});
  }
  const blog = await BlogModal.findOne({ _id: blogId });
  if (blog) {
    await blog.addCommentToDB(userId, title, comment);
    await blog.save();
    res.status(201).json({ message: "comment added successfully" });
}
else{
  return res.status(401).json({error : 'Internal server error'});
}
}

export async function getComments(req, res){
  const id = req.query.blogId;
  const count = req.query.count;

  try {
    const blog = await BlogModal.findById(id).populate('comments.userId');

    if (!blog) {
      return res.status(404).json({ error: 'Blog not found.' });
    }
    const limitedComments = blog.comments.slice(0, count);

    res.json(limitedComments);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function editUserDetails(req, res){
  const id = req.body.id;
  const name = req.body.name;
  const address = req.body.address;
  const gender = req.body.gender;
  const city = req.body.city;
  const State = req.body.State;
  const pincode = req.body.pincode;

  if(!id || !name || !address || !gender ||  !city || !State || !pincode ){
    return res.status(400).json({message : 'All Fields required'});
  }
  const user = await UserModal.findByIdAndUpdate(id,  {
    name,
    address,
    gender,
    city,
    State,
    pincode,
  },
  { new: true } );
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.status(201).json({ message: 'User details updated'});
}






