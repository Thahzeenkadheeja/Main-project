var express = require("express");
var parentHelper = require("../helper/parentHelper");
var teacherHelper = require("../helper/teacherHelper");

var router = express.Router();
var db = require("../config/connection");
var collections = require("../config/collections");
const ObjectId = require("mongodb").ObjectID;

const verifySignedIn = (req, res, next) => {
  if (req.session.signedIn) {
    next();
  } else {
    res.redirect("/parents/signin");
  }
};

/* GET home page. */
router.get("/", verifySignedIn, async function (req, res, next) {
  let parent = req.session.parent;
  parentHelper.getAllworkspaces().then((workspaces) => {
    res.render("parents/home", { admin: false, workspaces, parent });
  });
});


router.get("/notifications", verifySignedIn, function (req, res) {
  let parent = req.session.parent;  // Get logged-in parent from session

  // Use the parent._id to fetch notifications for the logged-in parent
  parentHelper.getnotificationById(parent._id).then((notifications) => {
    res.render("parents/notifications", { admin: false, notifications, parent });
  }).catch((err) => {
    console.error("Error fetching notifications:", err);
    res.status(500).send("Error fetching notifications");
  });
});

router.get("/about", async function (req, res) {
  res.render("parents/about", { admin: false, });
})


router.get("/contact", async function (req, res) {
  res.render("parents/contact", { admin: false, });
})

router.get("/service", async function (req, res) {
  res.render("parents/service", { admin: false, });
})


router.post("/add-feedback", async function (req, res) {
  let parent = req.session.parent; // Ensure the parent is logged in and the session is set
  let feedbackText = req.body.text; // Get feedback text from form input
  let parentname = req.body.parentname; // Get parentname from form input
  let workspaceId = req.body.workspaceId; // Get workspace ID from form input
  let teacherId = req.body.teacherId; // Get teacher ID from form input

  if (!parent) {
    return res.status(403).send("Parent not logged in");
  }

  try {
    const feedback = {
      parentId: ObjectId(parent._id), // Convert parent ID to ObjectId
      workspaceId: ObjectId(workspaceId), // Convert workspace ID to ObjectId
      teacherId: ObjectId(teacherId), // Convert teacher ID to ObjectId
      text: feedbackText,
      parentname: parentname,
      createdAt: new Date() // Store the timestamp
    };

    await parentHelper.addFeedback(feedback);
    res.redirect("/single-workspace/" + workspaceId); // Redirect back to the workspace page
  } catch (error) {
    console.error("Error adding feedback:", error);
    res.status(500).send("Server Error");
  }
});



router.get("/single-workspace/:id", async function (req, res) {
  let parent = req.session.parent;
  const workspaceId = req.params.id;

  try {
    const workspace = await parentHelper.getWorkspaceById(workspaceId);

    if (!workspace) {
      return res.status(404).send("Workspace not found");
    }
    const feedbacks = await parentHelper.getFeedbackByWorkspaceId(workspaceId); // Fetch feedbacks for the specific workspace

    res.render("parents/single-workspace", {
      admin: false,
      parent,
      workspace,
      feedbacks
    });
  } catch (error) {
    console.error("Error fetching workspace:", error);
    res.status(500).send("Server Error");
  }
});




////////////////////PROFILE////////////////////////////////////
router.get("/profile", async function (req, res, next) {
  let parent = req.session.parent;
  res.render("parents/profile", { admin: false, parent });
});

////////////////////PARENT TYPE////////////////////////////////////
router.get("/parenttype", async function (req, res, next) {
  res.render("parents/parenttype", { admin: false, layout: 'empty' });
});





router.get("/signup", function (req, res) {
  if (req.session.signedIn) {
    res.redirect("/");
  } else {
    res.render("parents/signup", { admin: false, layout: 'empty' });
  }
});

router.post("/signup", async function (req, res) {
  const { Fname, Email, Phone, Address, Pincode, District, Password } = req.body;
  let errors = {};

  // Check if email already exists
  const existingEmail = await db.get()
    .collection(collections.PARENT_COLLECTION)
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
      .collection(collections.PARENT_COLLECTION)
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
    return res.render("parents/signup", {
      admin: false,
      layout: 'empty',
      errors,
      Fname,
      Email,
      Phone,
      Address,
      Pincode,
      District,
      Password
    });
  }

  // Proceed with signup
  parentHelper.doSignup(req.body).then((response) => {
    req.session.signedIn = true;
    req.session.parent = response;
    res.redirect("/parents");
  }).catch((err) => {
    console.error("Signup error:", err);
    res.status(500).send("An error occurred during signup.");
  });
});


router.get("/signin", function (req, res) {
  if (req.session.signedIn) {
    res.redirect("/parents");
  } else {
    res.render("parents/signin", {
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
    return res.render("parents/signin", {
      admin: false,
      layout: 'empty',
      signInErr: req.session.signInErr,
      email: Email,
      password: Password,
    });
  }

  parentHelper.doSignin(req.body).then((response) => {
    if (response.status) {
      req.session.signedIn = true;
      req.session.parent = response.parent;
      res.redirect("/parents");
    } else {
      // If the parent is disabled, display the message
      req.session.signInErr = response.msg || "Invalid Email/Password";
      res.render("parents/signin", {
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
  req.session.parent = null;
  res.redirect("/parents");
});

router.get("/edit-profile/:id", verifySignedIn, async function (req, res) {
  let parent = req.session.parent;
  let parentId = req.session.parent._id;
  let parentProfile = await parentHelper.getParentDetails(parentId);
  res.render("parents/edit-profile", { admin: false, parentProfile, parent });
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
      let parentProfile = await parentHelper.getParentDetails(req.params.id);
      return res.render("parents/edit-profile", {
        admin: false,
        parentProfile,
        parent: req.session.parent,
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

    // Update the parent profile
    await parentHelper.updateParentProfile(req.params.id, req.body);

    // Fetch the updated parent profile and update the session
    let updatedParentProfile = await parentHelper.getParentDetails(req.params.id);
    req.session.parent = updatedParentProfile;

    // Redirect to the profile page
    res.redirect("/profile");
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).send("An error occurred while updating the profile.");
  }
});





router.get('/place-order/:id', verifySignedIn, async (req, res) => {
  const workspaceId = req.params.id;

  // Validate the workspace ID
  if (!ObjectId.isValid(workspaceId)) {
    return res.status(400).send('Invalid workspace ID format');
  }

  let parent = req.session.parent;

  // Fetch the product details by ID
  let workspace = await parentHelper.getWorkspaceDetails(workspaceId);

  // If no workspace is found, handle the error
  if (!workspace) {
    return res.status(404).send('Workspace not found');
  }

  // Render the place-order page with workspace details
  res.render('parents/place-order', { parent, workspace });
});

router.post('/place-order', async (req, res) => {
  let parent = req.session.parent;
  let workspaceId = req.body.workspaceId;

  // Fetch workspace details
  let workspace = await parentHelper.getWorkspaceDetails(workspaceId);
  let totalPrice = workspace.Price; // Get the price from the workspace

  // Call placeOrder function
  parentHelper.placeOrder(req.body, workspace, totalPrice, parent)
    .then((orderId) => {
      if (req.body["payment-method"] === "COD") {
        res.json({ codSuccess: true });
      } else {
        parentHelper.generateRazorpay(orderId, totalPrice).then((response) => {
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
  parentHelper
    .verifyPayment(req.body)
    .then(() => {
      parentHelper.changePaymentStatus(req.body["order[receipt]"]).then(() => {
        res.json({ status: true });
      });
    })
    .catch((err) => {
      res.json({ status: false, errMsg: "Payment Failed" });
    });
});

router.get("/order-placed", verifySignedIn, async (req, res) => {
  let parent = req.session.parent;
  let parentId = req.session.parent._id;
  // le = await parentHelper.g(parentId);
  res.render("parents/order-placed", { admin: false, parent });
});

router.get("/orders", verifySignedIn, async function (req, res) {
  let parent = req.session.parent;
  let parentId = req.session.parent._id;
  // Fetch parent orders
  let orders = await parentHelper.getParentOrder(parentId);
  res.render("parents/orders", { admin: false, parent, orders });
});

router.get("/view-ordered-workspaces/:id", verifySignedIn, async function (req, res) {
  let parent = req.session.parent;
  let orderId = req.params.id;

  // Log the orderId to see if it's correctly retrieved
  console.log("Retrieved Order ID:", orderId);

  // Check if orderId is valid
  if (!ObjectId.isValid(orderId)) {
    console.error('Invalid Order ID format:', orderId);  // Log the invalid ID
    return res.status(400).send('Invalid Order ID');
  }

  try {
    let workspaces = await parentHelper.getOrderWorkspaces(orderId);
    res.render("parents/order-workspaces", {
      admin: false,
      parent,
      workspaces,
    });
  } catch (err) {
    console.error('Error fetching ordered workspaces:', err);
    res.status(500).send('Internal Server Error');
  }
});



router.get("/cancel-order/:id", verifySignedIn, function (req, res) {
  let orderId = req.params.id;
  parentHelper.cancelOrder(orderId).then(() => {
    res.redirect("/orders");
  });
});

router.post("/search", verifySignedIn, async function (req, res) {
  let parent = req.session.parent;
  let parentId = req.session.parent._id;
  // le = await parentHelper.g(parentId);
  parentHelper.searchProduct(req.body).then((response) => {
    res.render("parents/search-result", { admin: false, parent, response });
  });
});

module.exports = router;
