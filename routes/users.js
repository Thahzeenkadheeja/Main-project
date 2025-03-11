var express = require("express");
var userHelper = require("../helper/userHelper");
var teacherHelper = require("../helper/teacherHelper");
var adminHelper = require("../helper/adminHelper");

var router = express.Router();
var db = require("../config/connection");
var collections = require("../config/collections");
const ObjectId = require("mongodb").ObjectID;

const fs = require("fs");
const path = require("path");

const verifySignedIn = (req, res, next) => {
  if (req.session.signedIn) {
    next();
  } else {
    res.redirect("/signin");
  }
};

/* GET home page. */
router.get("/", verifySignedIn, async function (req, res, next) {
  let user = req.session.user;
  userHelper.getAlltasks().then((tasks) => {
    res.render("users/home", { admin: false, tasks, user });
  });
});


router.get("/notifications", verifySignedIn, function (req, res) {
  let user = req.session.user;  // Get logged-in user from session

  // Use the user._id to fetch notifications for the logged-in user
  userHelper.getnotificationById(user._id).then((notifications) => {
    res.render("users/notifications", { admin: false, notifications, user });
  }).catch((err) => {
    console.error("Error fetching notifications:", err);
    res.status(500).send("Error fetching notifications");
  });
});

router.get("/about", async function (req, res) {
  res.render("users/about", { admin: false, });
})


router.get("/contact", async function (req, res) {
  res.render("users/contact", { admin: false, });
})

router.get("/service", async function (req, res) {
  res.render("users/service", { admin: false, });
})


router.post("/add-feedback", async function (req, res) {
  let user = req.session.user; // Ensure the user is logged in and the session is set
  let feedbackText = req.body.text; // Get feedback text from form input
  let username = req.body.username; // Get username from form input
  let taskId = req.body.taskId; // Get task ID from form input
  let teacherId = req.body.teacherId; // Get teacher ID from form input

  if (!user) {
    return res.status(403).send("User not logged in");
  }

  try {
    const feedback = {
      userId: ObjectId(user._id), // Convert user ID to ObjectId
      taskId: ObjectId(taskId), // Convert task ID to ObjectId
      teacherId: ObjectId(teacherId), // Convert teacher ID to ObjectId
      text: feedbackText,
      username: username,
      createdAt: new Date() // Store the timestamp
    };

    await userHelper.addFeedback(feedback);
    res.redirect("/view-task/" + taskId); // Redirect back to the task page
  } catch (error) {
    console.error("Error adding feedback:", error);
    res.status(500).send("Server Error");
  }
});



router.post("/add-assignment", async function (req, res) {
  let user = req.session.user; // Ensure the user is logged in and the session is set
  let feedbackText = req.body.text; // Get feedback text from form input
  let username = req.body.username; // Get username from form input
  let taskId = req.body.taskId; // Get task ID from form input
  let teacherId = req.body.teacherId; // Get teacher ID from form input

  if (!user) {
    return res.status(403).send("User not logged in");
  }

  try {
    const feedback = {
      userId: ObjectId(user._id), // Convert user ID to ObjectId
      taskId: ObjectId(taskId), // Convert task ID to ObjectId
      teacherId: ObjectId(teacherId), // Convert teacher ID to ObjectId
      text: feedbackText,
      username: username,
      createdAt: new Date(), // Store the timestamp
      image: "", // Placeholder for image path
    };

    // Check if an image file is uploaded
    if (req.files && req.files.image) {
      let image = req.files.image;
      let imagePath = "./public/images/assignment-images/" + new ObjectId() + path.extname(image.name);

      // Ensure the directory exists
      let dir = "./public/images/assignment-images/";
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // Move the file to the destination
      await image.mv(imagePath);
      feedback.image = imagePath.replace("./public", ""); // Store relative path
    }

    await userHelper.addFeedback(feedback);
    res.redirect("/view-task/" + taskId); // Redirect back to the task page
  } catch (error) {
    console.error("Error adding feedback:", error);
    res.status(500).send("Server Error");
  }
});



router.get("/single-task/:id", async function (req, res) {
  let user = req.session.user;
  const taskId = req.params.id;

  try {
    const task = await userHelper.getTaskById(taskId);

    if (!task) {
      return res.status(404).send("Task not found");
    }
    const feedbacks = await userHelper.getFeedbackByTaskId(taskId); // Fetch feedbacks for the specific task

    res.render("users/single-task", {
      admin: false,
      user,
      task,
      feedbacks
    });
  } catch (error) {
    console.error("Error fetching task:", error);
    res.status(500).send("Server Error");
  }
});




////////////////////PROFILE////////////////////////////////////
router.get("/profile", async function (req, res, next) {
  let user = req.session.user;
  res.render("users/profile", { admin: false, user });
});

////////////////////USER TYPE////////////////////////////////////
router.get("/usertype", async function (req, res, next) {
  res.render("users/usertype", { admin: false, layout: 'empty' });
});





router.get("/signup", function (req, res) {
  if (req.session.signedIn) {
    res.redirect("/");
  } else {
    res.render("users/signup", { admin: false, layout: 'empty' });
  }
});

router.post("/signup", async function (req, res) {
  const { Fname, Email, Phone, Address, Pincode, District, Password, Pname, Blood } = req.body;
  let errors = {};

  // Check if email already exists
  const existingEmail = await db.get()
    .collection(collections.USERS_COLLECTION)
    .findOne({ Email });

  if (existingEmail) {
    errors.email = "This email is already registered.";
  }

  // Validate phone number length and uniqueness
  if (!Phone) {
    errors.phone = "Please enter your phone number.";
  } else if (!/^\d{10}$/.test(Phone)) {
    errors.phone = "Phone number must be exactly 10 digits.";
  } else {
    const existingPhone = await db.get()
      .collection(collections.USERS_COLLECTION)
      .findOne({ Phone });

    if (existingPhone) {
      errors.phone = "This phone number is already registered.";
    }
  }

  // Validate Pincode
  if (!Pincode) {
    errors.pincode = "Please enter your pincode.";
  } else if (!/^\d{6}$/.test(Pincode)) {
    errors.pincode = "Pincode must be exactly 6 digits.";
  }

  if (!Fname) errors.fname = "Please enter your first name.";
  if (!Email) errors.email = "Please enter your email.";
  if (!Address) errors.address = "Please enter your address.";
  if (!District) errors.district = "Please enter your city.";
  if (!Pname) errors.pname = "Please enter your parent name.";
  if (!Blood) errors.blood = "Please enter your blood group.";

  // Password validation
  if (!Password) {
    errors.password = "Please enter a password.";
  } else {
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;
    if (!strongPasswordRegex.test(Password)) {
      errors.password = "Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.";
    }
  }

  if (Object.keys(errors).length > 0) {
    return res.render("users/signup", {
      admin: false,
      layout: 'empty',
      errors,
      Fname,
      Email,
      Phone,
      Address,
      Pincode,
      District,
      Password,
      Pname,
      Blood
    });
  }

  // Proceed with signup
  userHelper.doSignup(req.body).then(async (response) => {
    if (!response) {
      req.session.signUpErr = "Signup failed.";
      return res.redirect("/users/signup");
    }

    // Extract user ID
    const userId = response._id ? response._id.toString() : response.toString();

    // Ensure the user image directory exists
    const imageDir = "./public/images/user-images/";
    if (!fs.existsSync(imageDir)) {
      fs.mkdirSync(imageDir, { recursive: true });
    }

    // Handle image upload
    if (req.files && req.files.Image) {
      let image = req.files.Image;
      let imagePath = path.join(imageDir, userId + ".png");  // Save as <userID>.png

      console.log("Saving image to:", imagePath);

      // Move the uploaded file to the target location
      image.mv(imagePath, (err) => {
        if (!err) {
          // On successful image upload, proceed
          req.session.signedIn = true;
          req.session.user = response;
          res.redirect("/");
        } else {
          console.log("Error saving image:", err);
          res.status(500).send("Error uploading image");
        }
      });
    } else {
      // No image uploaded, proceed without it
      req.session.signedIn = true;
      req.session.user = response;
      res.redirect("/");
    }
  }).catch((err) => {
    console.error("Signup error:", err);
    res.status(500).send("An error occurred during signup.");
  });
});


router.get("/signin", function (req, res) {
  if (req.session.signedIn) {
    res.redirect("/");
  } else {
    res.render("users/signin", {
      admin: false,
      layout: 'empty',
      signInErr: req.session.signInErr,
    });
    req.session.signInErr = null;
  }
});


router.post("/signin", function (req, res) {
  const { Email, Password } = req.body;

  if (!Email || !Password) {
    req.session.signInErr = "Please fill in all fields.";
    return res.render("users/signin", {
      admin: false,
      layout: 'empty',
      signInErr: req.session.signInErr,
      email: Email,
      password: Password,
    });
  }

  userHelper.doSignin(req.body).then((response) => {
    if (response.status) {
      req.session.signedIn = true;
      req.session.user = response.user;
      res.redirect("/");
    } else {
      // If the user is disabled, display the message
      req.session.signInErr = response.msg || "Invalid Email/Password";
      res.render("users/signin", {
        admin: false,
        layout: 'empty',
        signInErr: req.session.signInErr,
        email: Email
      });
    }
  });
});



router.get("/parent-signin", function (req, res) {
  if (req.session.signedIn) {
    res.redirect("/");
  } else {
    res.render("users/parent-signin", {
      admin: false,
      layout: 'empty',
      signInErr: req.session.signInErr,
    });
    req.session.signInErr = null;
  }
});


router.post("/parent-signin", function (req, res) {
  const { Email, Password } = req.body;

  if (!Email || !Password) {
    req.session.signInErr = "Please fill in all fields.";
    return res.render("users/parent-signin", {
      admin: false,
      layout: 'empty',
      signInErr: req.session.signInErr,
      email: Email,
      password: Password,
    });
  }

  userHelper.doSignin(req.body).then((response) => {
    if (response.status) {
      req.session.signedIn = true;
      req.session.user = response.user;
      res.redirect("/");
    } else {
      // If the user is disabled, display the message
      req.session.signInErr = response.msg || "Invalid Email/Password";
      res.render("users/parent-signin", {
        admin: false,
        layout: 'empty',
        signInErr: req.session.signInErr,
        email: Email
      });
    }
  });
});



router.get("/signout", function (req, res) {
  req.session.signedIn = false;
  req.session.user = null;
  res.redirect("/");
});

router.get("/edit-profile/:id", verifySignedIn, async function (req, res) {
  let user = req.session.user;
  let userId = req.session.user._id;
  let userProfile = await userHelper.getUserDetails(userId);
  res.render("users/edit-profile", { admin: false, userProfile, user });
});

router.post("/edit-profile/:id", verifySignedIn, async function (req, res) {
  try {
    const { Fname, Lname, Email, Phone, Address, District, Pincode } = req.body;
    let errors = {};

    // Validate first name
    if (!Fname || Fname.trim().length === 0) {
      errors.fname = 'Please enter your first name.';
    }

    if (!District || District.trim().length === 0) {
      errors.district = 'Please enter your first name.';
    }

    // Validate last name
    if (!Lname || Lname.trim().length === 0) {
      errors.lname = 'Please enter your last name.';
    }

    // Validate email format
    if (!Email || !/^\S+@\S+\.\S+$/.test(Email)) {
      errors.email = 'Please enter a valid email address.';
    }

    // Validate phone number
    if (!Phone) {
      errors.phone = "Please enter your phone number.";
    } else if (!/^\d{10}$/.test(Phone)) {
      errors.phone = "Phone number must be exactly 10 digits.";
    }


    // Validate pincode
    if (!Pincode) {
      errors.pincode = "Please enter your pincode.";
    } else if (!/^\d{6}$/.test(Pincode)) {
      errors.pincode = "Pincode must be exactly 6 digits.";
    }

    if (!Fname) errors.fname = "Please enter your first name.";
    if (!Lname) errors.lname = "Please enter your last name.";
    if (!Email) errors.email = "Please enter your email.";
    if (!Address) errors.address = "Please enter your address.";
    if (!District) errors.district = "Please enter your district.";

    // Validate other fields as needed...

    // If there are validation errors, re-render the form with error messages
    if (Object.keys(errors).length > 0) {
      let userProfile = await userHelper.getUserDetails(req.params.id);
      return res.render("users/edit-profile", {
        admin: false,
        userProfile,
        user: req.session.user,
        errors,
        Fname,
        Lname,
        Email,
        Phone,
        Address,
        District,
        Pincode,
      });
    }

    // Update the user profile
    await userHelper.updateUserProfile(req.params.id, req.body);

    // Fetch the updated user profile and update the session
    let updatedUserProfile = await userHelper.getUserDetails(req.params.id);
    req.session.user = updatedUserProfile;

    // Redirect to the profile page
    res.redirect("/profile");
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).send("An error occurred while updating the profile.");
  }
});





router.get('/place-order/:id', verifySignedIn, async (req, res) => {
  const taskId = req.params.id;

  // Validate the task ID
  if (!ObjectId.isValid(taskId)) {
    return res.status(400).send('Invalid task ID format');
  }

  let user = req.session.user;

  // Fetch the product details by ID
  let task = await userHelper.getTaskDetails(taskId);

  // If no task is found, handle the error
  if (!task) {
    return res.status(404).send('Task not found');
  }

  // Render the place-order page with task details
  res.render('users/place-order', { user, task });
});

router.post('/place-order', async (req, res) => {
  let user = req.session.user;
  let taskId = req.body.taskId;

  // Fetch task details
  let task = await userHelper.getTaskDetails(taskId);
  let totalPrice = task.Price; // Get the price from the task

  // Call placeOrder function
  userHelper.placeOrder(req.body, task, totalPrice, user)
    .then((orderId) => {
      if (req.body["payment-method"] === "COD") {
        res.json({ codSuccess: true });
      } else {
        userHelper.generateRazorpay(orderId, totalPrice).then((response) => {
          res.json(response);
        });
      }
    })
    .catch((err) => {
      console.error("Error placing order:", err);
      res.status(500).send("Internal Server Error");
    });
});



router.post("/verify-payment", async (req, res) => {
  console.log(req.body);
  userHelper
    .verifyPayment(req.body)
    .then(() => {
      userHelper.changePaymentStatus(req.body["order[receipt]"]).then(() => {
        res.json({ status: true });
      });
    })
    .catch((err) => {
      res.json({ status: false, errMsg: "Payment Failed" });
    });
});

router.get("/order-placed", verifySignedIn, async (req, res) => {
  let user = req.session.user;
  let userId = req.session.user._id;
  // le = await userHelper.g(userId);
  res.render("users/order-placed", { admin: false, user });
});

router.get("/orders", verifySignedIn, async function (req, res) {
  let user = req.session.user;
  let userId = req.session.user._id;
  // Fetch user orders
  let orders = await userHelper.getUserOrder(userId);
  res.render("users/orders", { admin: false, user, orders });
});

router.get("/view-ordered-tasks/:id", verifySignedIn, async function (req, res) {
  let user = req.session.user;
  let orderId = req.params.id;
  console.log("Retrieved Order ID:", orderId);
  if (!ObjectId.isValid(orderId)) {
    console.error('Invalid Order ID format:', orderId);  // Log the invalid ID
    return res.status(400).send('Invalid Order ID');
  }
  try {
    let tasks = await userHelper.getOrderTasks(orderId);
    res.render("users/order-tasks", {
      admin: false,
      user,
      tasks,
    });
  } catch (err) {
    console.error('Error fetching ordered tasks:', err);
    res.status(500).send('Internal Server Error');
  }
});



router.get("/cancel-order/:id", verifySignedIn, function (req, res) {
  let orderId = req.params.id;
  userHelper.cancelOrder(orderId).then(() => {
    res.redirect("/orders");
  });
});

router.post("/search", verifySignedIn, async function (req, res) {
  let user = req.session.user;
  let userId = req.session.user._id;
  // le = await userHelper.g(userId);
  userHelper.searchProduct(req.body).then((response) => {
    res.render("users/search-result", { admin: false, user, response });
  });
});


///////ALL attendances/////////////////////                                         
router.get("/attendance", verifySignedIn, async function (req, res) {
  try {
    let user = req.session.user;
    if (!user || !user._id) {
      return res.status(403).send("Unauthorized");
    }
    const attendanceData = await userHelper.getAllattendancebyid(user._id);  // ✅ Pass user ID

    console.log("Attendance Data:", JSON.stringify(attendanceData, null, 2)); // Debugging

    res.render("users/attendance", {
      admin: false,
      layout: 'layout',
      attendance: attendanceData,
      user
    });

  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/all-materials", verifySignedIn, function (req, res) {
  let user = req.session.user;
  userHelper.getAllmaterials().then((materials) => {
    res.render("users/all-materials", { admin: false, materials, user });
  });
});

router.get("/announcements", verifySignedIn, async function (req, res) {
  let user = req.session.user;
  let announcements = await adminHelper.getAllanouncements();
  console.log("------", announcements);
  res.render("users/announcements", { admin: false, announcements, user });
});


router.get("/tasks", verifySignedIn, function (req, res) {
  let user = req.session.user;
  userHelper.getAlltasks().then((tasks) => {
    res.render("users/tasks", { admin: false, tasks, user });
  });
});

router.get("/view-task/:id", verifySignedIn, async function (req, res) {
  let user = req.session.user;
  const taskId = req.params.id;

  try {
    const task = await userHelper.getTaskById(taskId);

    const feedbacks = await userHelper.getFeedbackByTaskId(taskId); // Fetch feedbacks for the specific task


    if (!task) {
      return res.status(404).send("Task not found");
    }

    res.render("users/view-task", {
      admin: false,
      user,
      task,
      feedbacks,
    });
  } catch (error) {
    console.error("Error fetching task:", error);
    res.status(500).send("Server Error");
  }
});


router.post("/add-hw", async function (req, res) {
  let user = req.session.user; // Ensure the user is logged in and the session is set
  let feedbackText = req.body.text; // Get feedback text from form input
  let username = req.body.username; // Get username from form input
  let homeworkId = req.body.homeworkId; // Get homework ID from form input
  let teacherId = req.body.teacherId; // Get teacher ID from form input

  if (!user) {
    return res.status(403).send("User not logged in");
  }

  try {
    const feedback = {
      userId: ObjectId(user._id), // Convert user ID to ObjectId
      homeworkId: ObjectId(homeworkId), // Convert homework ID to ObjectId
      teacherId: ObjectId(teacherId), // Convert teacher ID to ObjectId
      text: feedbackText,
      username: username,
      createdAt: new Date(), // Store the timestamp
      image: "", // Placeholder for image path
    };

    // Check if an image file is uploaded
    if (req.files && req.files.image) {
      let image = req.files.image;
      let imagePath = "./public/images/hw-images/" + new ObjectId() + path.extname(image.name);

      // Ensure the directory exists
      let dir = "./public/images/hw-images/";
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // Move the file to the destination
      await image.mv(imagePath);
      feedback.image = imagePath.replace("./public", ""); // Store relative path
    }

    await userHelper.addFeedback(feedback);
    res.redirect("/view-homework/" + homeworkId); // Redirect back to the task page
  } catch (error) {
    console.error("Error adding feedback:", error);
    res.status(500).send("Server Error");
  }
});


router.get("/homework", verifySignedIn, function (req, res) {
  let user = req.session.user;
  userHelper.getAllhomeworks().then((homeworks) => {
    res.render("users/homework", { admin: false, homeworks, user });
  });
});

router.get("/view-homework/:id", verifySignedIn, async function (req, res) {
  let user = req.session.user;
  const homeworkId = req.params.id;

  try {
    const homework = await userHelper.getHomeworkById(homeworkId);

    const feedbacks = await userHelper.getFeedbackByHomeworkId(homeworkId); // Fetch feedbacks for the specific homework


    if (!homework) {
      return res.status(404).send("Homework not found");
    }

    res.render("users/view-homework", {
      admin: false,
      user,
      homework,
      feedbacks,
    });
  } catch (error) {
    console.error("Error fetching homework:", error);
    res.status(500).send("Server Error");
  }
});



router.get("/timetable", verifySignedIn, async function (req, res) {
  let user = req.session.user;

  console.log("Logged-in User:", user); // ✅ Debugging user details
  console.log("User's Class:", user.Class); // ✅ Checking the Class value

  if (!user || !user.Class) {
    console.error("User class not found!");
    return res.redirect("/login"); // Redirect if class info is missing
  }

  let timetable;
  let userClass = parseInt(user.Class); // Ensure it's an integer

  switch (userClass) {
    case 1:
      timetable = await adminHelper.getAllTimetablesC1();
      break;
    case 2:
      timetable = await adminHelper.getAllTimetablesC2();
      break;
    case 3:
      timetable = await adminHelper.getAllTimetablesC3();
      break;
    case 4:
      timetable = await adminHelper.getAllTimetablesC4();
      break;
    case 5:
      timetable = await adminHelper.getAllTimetablesC5();
      break;
    case 6:
      timetable = await adminHelper.getAllTimetablesC6();
      break;
    case 7:
      timetable = await adminHelper.getAllTimetablesC7();
      break;
    default:
      console.error("Invalid class:", userClass);
      timetable = []; // Return an empty array if class is invalid
  }

  console.log("Timetable Data:", timetable); // ✅ Debugging fetched timetable
  // Pass only the relevant timetable
  res.render("users/timetable", { admin: false, user, timetable });
});





module.exports = router;
