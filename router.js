import express from "express";
const router = express.Router();
import AdminModal from './modals/admin.js';
import jwt from "jsonwebtoken";
import cors from 'cors';
import sendEmail from "./sendEmail.js";
import Usermodal from "./modals/user.js";
import CategoryModal from "./modals/jobCategory.js";
import ListingModal from "./modals/Listing.js";
import TypeModal from "./modals/jobType.js";
import ApplicationModal from "./modals/application.js";

router.use(cors())

function generateToken(user) {
    try {
        const payload = {
            id: user._id.toString(), // Convert ObjectId to a string
            name: user.name,
            password:user.password
          };
          const token = jwt.sign(payload, process.env.SECRET_KEY);
        return token;
    } catch (err) {
        console.log(err);
    }
}


//for admin login, name = admin & password = admin
router.post('/adminLogin', async function(req, res){
    try {
      const name = req.body.name;
      const password = req.body.password;
      if (!name || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
      }
      const user = await AdminModal.findOne({ name: name });
      if(user && user.password === password){
        const token = generateToken(user);
        res.status(201).json({ message: 'User logged in Successfully', token });
      }
      else{
        res.status(401).json({ message: 'Invalid user name or password'});
      }
    } catch (error) {
        console.log(error);
      res.status(500).json({ error: 'Error in server side ' });
    }
  });

  

  router.post('/candidateLogin', async function(req, res){
    try {
      const email = req.body.name;
      const password = req.body.password;
      if (!email || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
      }
      const user = await Usermodal.findOne({ email: email });
      if(user && user.password === password){
        res.status(201).json({ message: 'User logged in Successfully' });
      }
      else{
        res.status(401).json({ message: 'Invalid user name or password'});
      }
    } catch (error) {
        console.log(error);
      res.status(500).json({ error: 'Error in server side ' });
    }
  });

  

  router.post('/addJobCategory', async function(req, res){
    try {
      const category = req.body.cat;
      if (!category) {
        return res.status(400).json({ error: 'all fields required.' });
      }
      const data = new CategoryModal({category});
      await data.save();
      res.status(201).json({ message: "Category added successfully"})
      
    } catch (error) {
        console.log(error);
      res.status(500).json({ error: 'Error in server side ' });
    }
  });
  router.post('/addJobType', async function(req, res){
    try {
      const type = req.body.type;
      if (!type) {
        return res.status(400).json({ error: 'all fields required.' });
      }
      const data = new TypeModal({type});
      await data.save();
      res.status(201).json({ message: "Type added successfully"})
      
    } catch (error) {
        console.log(error);
      res.status(500).json({ error: 'Error in server side ' });
    }
  });

  router.get('/getJobCategory', async function(req, res){
    try {
      const data = await CategoryModal.find().collation({ locale: 'en', strength: 2 }).sort({ name: 1 });
      res.send(data);
    } catch (error) {
      console.log(error);
    }
  });
  router.get('/getJobType', async function(req, res){
    try {
      const data = await TypeModal.find().collation({ locale: 'en', strength: 2 }).sort({ name: 1 });
      res.send(data);
    } catch (error) {
      console.log(error);
    }
  });
  
  router.get('/getListing', async function(req, res){
    try {
      const data = await ListingModal.find().collation({ locale: 'en', strength: 2 }).sort({ name: 1 });
      res.send(data);
    } catch (error) {
      console.log(error);
    }
  });
  router.get('/getJobApplies', async function(req, res){
    try {
      const data = await ApplicationModal.find().collation({ locale: 'en', strength: 2 }).sort({ name: 1 });
      res.send(data);
    } catch (error) {
      console.log(error);
    }
  });

router.post('/getJobById', async function(req, res){
  const id = req.body.id;
  try {
    const data = await ListingModal.find({_id:id});
    res.send(data);
  } catch (error) {
    console.log(error);
  }
} )

  router.post('/register', async function(req, res){
    const email = req.body.name;
    const password = req.body.password;
    try {
      let userExist = await Usermodal.findOne({ email: email });

      if (userExist) {
          return res.status(422).json({ error: "Email already exist" });
      }
      else {
          const user = new Usermodal({ email, password });

          await user.save();
          await sendEmail(user.email, "User Registered Successfully", `User Registration successful. Your user id is ${email}, and password is ${password}`);
          res.status(201).json({ message: "An email sent to your account, please verify!" });
      }
  } catch (error) {
      console.log(error);
  }

  });
  router.post('/apply', async function(req, res){
    const {title, details, exp, name, email, downloadURL, status} = req.body;
    try {
      const application = new ApplicationModal({title, details, exp, name, email, downloadURL, status})
    await application.save();
    await sendEmail(email, "Applied Successfully", `Congratulations candidate, you have successfully applied to ${details}.`);
    res.status(201).json({ message: "Application Submitted Successfully" });
    } catch (error) {
      console.log(error);
    }
    
  });

  
  router.post('/addListing', async function(req, res){
    try {
      const data = req.body.newData;
      const newData = new ListingModal(data);
      // console.log(newData);
      await newData.save();
      res.status(201).json({ message: "Listing Added successfully"});
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: 'Error creating data entry' });
    }

  })

  router.post('/checkAdminTokenValid', async function (req, res){
    const {token} = req.body;
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        if(decoded){
          res.status(200).json({ message: 'Token is valid', decoded });
        }
        
      } catch (error) {
        res.status(401).json({ message: 'Token is invalid' });
      }
    
});

router.post('/editApplication1', async function(req, res){
  const {id, title, details, exp, name, email} = req.body;
  
    const updateOperation = {
      $set: {
        title: title,
        details: details,
        exp: exp,
        name: name,
        email: email,
      },
    };
    ApplicationModal.updateOne({ _id: id }, updateOperation)
  .then((result) => {
    if (result.nModified > 0) {
      // The document was updated successfully
      res.status(200).json({ message: 'Document updated successfully' });
    } else {
      // No document matched the provided _id
      res.status(404).json({ message: 'Document not found' });
    }
  })
  .catch((error) => {
    // Handle any errors that occurred during the update
    console.error('Error updating document:', error);
    res.status(500).json({ message: 'Server error' });
  });
  
});
router.post('/editApplication2', async function(req, res){
  const {id, downloadURL} = req.body;
  
    const updateOperation = {
      $set: {
        downloadURL: downloadURL
      },
    };
    ApplicationModal.updateOne({ _id: id }, updateOperation)
  .then((result) => {
    if (result.nModified > 0) {
      // The document was updated successfully
      res.status(200).json({ message: 'Document updated successfully' });
    } else {
      // No document matched the provided _id
      res.status(404).json({ message: 'Document not found' });
    }
  })
  .catch((error) => {
    // Handle any errors that occurred during the update
    console.error('Error updating document:', error);
    res.status(500).json({ message: 'Server error' });
  });
  
});
router.post('/editApplication3', async function(req, res) {
  const { id, selectedStatus, rejectReason, email } = req.body;
  const updateOperation = {
    $set: {
      status: selectedStatus
    }
  };

  if (selectedStatus === "Rejected") {
    try {
      await sendEmail(email, "Application Rejected", `Dear Candidate, your application status has been rejected. Reason for rejection - ${rejectReason}.`);
      const result = await ApplicationModal.updateOne({ _id: id }, updateOperation);

      if (result.nModified > 0) {
       
        res.status(200).json({ message: 'Status updated successfully' });
      } else {
        // No document matched the provided _id
        res.status(404).json({ message: 'Document not found' });
      }
    } catch (error) {
      console.error('Error updating document:', error);
      res.status(500).json({ message: 'Server error' });
    }
  } else {
    try {
      await sendEmail(email, "Application Status Changed", `Dear Candidate, your application status has been changed. New status is  ${selectedStatus}.`);
      const result = await ApplicationModal.updateOne({ _id: id }, updateOperation);

      if (result.nModified > 0) {
        
        res.status(200).json({ message: 'Status updated successfully' });
      } else {
        res.status(404).json({ message: 'Document not found' });
      }
    } catch (error) {
      console.error('Error updating document:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
});

export default router;