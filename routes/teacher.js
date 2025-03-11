var express = require("express");
var teacherHelper = require("../helper/teacherHelper");
var fs = require("fs");
const userHelper = require("../helper/userHelper");
const adminHelper = require("../helper/adminHelper");
const path = require("path");
var router = express.Router();
var db = require("../config/connection");
var collections = require("../config/collections");
const ObjectId = require("mongodb").ObjectID;


const verifySignedIn = (req, res, next) => {
  if (req.session.signedInTeacher) {
    next();
  } else {
    res.redirect("/teacher/signin");
  }
};

/* GET admins listing. */
router.get("/", verifySignedIn, async function (req, res, next) {
  let teacher = req.session.teacher; // ✅ Get the logged-in teacher's session data

  if (!teacher) {
    return res.redirect("/teacher/signin"); // ✅ Redirect if no teacher session exists
  }

  try {
    // ✅ Fetch teacher details along with the subject details using `$lookup`
    let teacherDetails = await db.get()
      .collection(collections.TEACHER_COLLECTION)
      .aggregate([
        {
          $match: { _id: new ObjectId(teacher._id) } // ✅ Match the logged-in teacher
        },
        {
          $lookup: {
            from: collections.SUBJECT_COLLECTION, // ✅ Join with SUBJECT_COLLECTION
            localField: "subject", // ✅ Match teacher's `subject` field
            foreignField: "_id", // ✅ Match `_id` from SUBJECT_COLLECTION
            as: "subjectDetails" // ✅ Store result as `subjectDetails`
          }
        },
        {
          $unwind: {
            path: "$subjectDetails", // ✅ Extract subject details (if exists)
            preserveNullAndEmptyArrays: true // ✅ Allow teachers with no subjects
          }
        }
      ])
      .toArray();

    if (teacherDetails.length > 0) {
      teacher = teacherDetails[0]; // ✅ Set the full teacher details
    }

    res.render("teacher/home", { teacher: true, layout: "layout", teacher });
  } catch (error) {
    console.error("Error fetching teacher details:", error);
    res.redirect("/login");
  }
});

///////ADD notification/////////////////////                                         
router.post("/submit-attendance", function (req, res) {
  console.log(req.body); // Log the entire request body for debugging

  const attendance = {
    date: req.body.date,
    selectedDate: req.body.selectedDate,
    period: req.body.period,
    Class: req.body.Class,

    teacherId: req.body.teacherId,
    subjectId: req.body.subjectId,
    subject: req.body.subject,

    present: req.body.present || [],
    absent: req.body.absent || [],

  };

  teacherHelper.addattendance(attendance, (id) => {
    if (id) {
      res.redirect("/teacher");
    } else {
      res.status(500).send("Error adding attendance");
    }
  });
});


///////ALL material/////////////////////                                         
router.get("/all-materials", verifySignedIn, function (req, res) {
  let teacher = req.session.teacher;
  teacherHelper.getAllmaterials(req.session.teacher._id).then((materials) => {
    res.render("teacher/all-materials", { teacher: true, materials, teacher });
  });
});

///////ADD workspace/////////////////////                                         
router.get("/add-material", verifySignedIn, function (req, res) {
  let teacher = req.session.teacher;
  res.render("teacher/add-material", { teacher: true, teacher });
});

///////ADD material/////////////////////                                         
router.post("/add-material", function (req, res) {
  if (req.session.signedInTeacher && req.session.teacher && req.session.teacher._id) {
    const teacherId = req.session.teacher._id;

    teacherHelper.addmaterial(req.body, teacherId, (materialId, error) => {
      if (error) {
        console.log("Error adding material:", error);
        return res.status(500).send("Failed to add material");
      }

      let fileFields = ["File1", "File2", "File3", "File4", "File5"]; // File input names from the form
      let uploadPromises = [];

      fileFields.forEach((field, index) => {
        if (req.files && req.files[field]) { // Check if the file exists
          let file = req.files[field];
          let filename = `${materialId}-${index + 1}.pdf`;
          let uploadPath = path.join(__dirname, "../public/images/materials/", filename);

          let uploadPromise = new Promise((resolve, reject) => {
            file.mv(uploadPath, (err) => {
              if (err) {
                console.log(`Error saving ${filename}:`, err);
                reject(err);
              } else {
                resolve();
              }
            });
          });

          uploadPromises.push(uploadPromise);
        }
      });

      Promise.all(uploadPromises)
        .then(() => {
          res.redirect("/teacher/all-materials");
        })
        .catch((err) => {
          res.status(500).send("Failed to save materials");
        });
    });
  } else {
    res.redirect("/teacher/signin");
  }
});


router.get("/delete-material/:id", verifySignedIn, function (req, res) {
  let materialId = req.params.id;
  teacherHelper.deletematerial(materialId).then((response) => {
    res.redirect("/teacher/all-materials");
  });
});






///////ALL task/////////////////////                                         
router.get("/all-tasks", verifySignedIn, function (req, res) {
  let teacher = req.session.teacher;
  teacherHelper.getAlltasks(req.session.teacher._id).then((tasks) => {
    res.render("teacher/all-tasks", { teacher: true, tasks, teacher });
  });
});

///////ADD workspace/////////////////////                                         
router.get("/add-task", verifySignedIn, function (req, res) {
  let teacher = req.session.teacher;
  res.render("teacher/add-task", { teacher: true, teacher });
});

///////ADD task/////////////////////                                         
router.post("/add-task", function (req, res) {
  if (req.session.signedInTeacher && req.session.teacher && req.session.teacher._id) {
    const teacherId = req.session.teacher._id;

    teacherHelper.addtask(req.body, teacherId, (taskId, error) => {
      if (error) {
        console.log("Error adding task:", error);
        return res.status(500).send("Failed to add task");
      }

      // Redirect to the all tasks page after adding the task
      res.redirect("/teacher/all-tasks");
    });
  } else {
    res.redirect("/teacher/signin");
  }
});



router.get("/delete-task/:id", verifySignedIn, function (req, res) {
  let taskId = req.params.id;
  teacherHelper.deletetask(taskId).then((response) => {
    res.redirect("/teacher/all-tasks");
  });
});






///////ALL notification/////////////////////                                         
router.get("/notifications", verifySignedIn, async function (req, res) {
  let teacher = req.session.teacher;

  // Ensure you have the teacher's ID available
  let teacherId = teacher._id; // Adjust based on how teacher ID is stored in session

  // Pass teacherId to getAllOrders
  let orders = await teacherHelper.getAllOrders(teacherId);
  let notifications = await teacherHelper.getnotificationById(teacherId)
  res.render("teacher/notifications", { teacher: true, layout: "layout", notifications, teacher, orders });
});

///////ADD notification/////////////////////                                         
router.get("/add-notification", verifySignedIn, function (req, res) {
  let teacher = req.session.teacher;
  res.render("teacher/all-notifications", { teacher: true, layout: "layout", teacher });
});

///////ADD notification/////////////////////                                         
router.post("/add-notification", function (req, res) {
  teacherHelper.addnotification(req.body, (id) => {
    res.redirect("/teacher/all-notifications");
  });
});

router.get("/delete-notification/:id", verifySignedIn, function (req, res) {
  let notificationId = req.params.id;
  adminHelper.deletenotification(notificationId).then((response) => {
    res.redirect("/teacher/all-notifications");
  });
});

///////EDIT notification/////////////////////                                         
router.get("/edit-notification/:id", verifySignedIn, async function (req, res) {
  let teacher = req.session.teacher;
  let notificationId = req.params.id;
  let notification = await teacherHelper.getnotificationDetails(notificationId);
  console.log(notification);
  res.render("teacher/edit-notification", { teacher: true, layout: "layout", notification, teacher });
});

///////EDIT notification/////////////////////                                         
router.post("/edit-notification/:id", verifySignedIn, function (req, res) {
  let notificationId = req.params.id;
  teacherHelper.updatenotification(notificationId, req.body).then(() => {
    if (req.files) {
      let image = req.files.Image;
      if (image) {
        image.mv("./public/images/notification-images/" + notificationId + ".png");
      }
    }
    res.redirect("/teacher/all-notifications");
  });
});

///////DELETE notification/////////////////////                                         
router.get("/delete-notification/:id", verifySignedIn, function (req, res) {
  let notificationId = req.params.id;
  teacherHelper.deletenotification(notificationId).then((response) => {
    res.redirect("/teacher/all-notifications");
  });
});

///////DELETE ALL notification/////////////////////                                         
router.get("/delete-all-notifications", verifySignedIn, function (req, res) {
  teacherHelper.deleteAllnotifications().then(() => {
    res.redirect("/teacher/all-notifications");
  });
});


////////////////////PROFILE////////////////////////////////////
router.get("/profile", async function (req, res, next) {
  let teacher = req.session.teacher;
  res.render("teacher/profile", { teacher: true, layout: "layout", teacher });
});


///////ALL workspace/////////////////////                                         
// router.get("/all-feedbacks", verifySignedIn, async function (req, res) {
//   let teacher = req.session.teacher;

//   const workspaceId = req.params.id;

//   console.log('workspace')

//   try {
//     const workspace = await userHelper.getWorkspaceById(workspaceId);
//     const feedbacks = await userHelper.getFeedbackByWorkspaceId(workspaceId); // Fetch feedbacks for the specific workspace
//     console.log('feedbacks', feedbacks)
//     res.render("teacher/all-feedbacks", { teacher: true, layout: "layout", workspace, feedbacks, teacher });
//   } catch (error) {
//     console.error("Error fetching workspace:", error);
//     res.status(500).send("Server Error");
//   }

// });


router.get("/teacher-feedback", async function (req, res) {
  let teacher = req.session.teacher; // Get the teacher from session

  if (!teacher) {
    return res.status(403).send("Teacher not logged in");
  }

  try {
    // Fetch feedback for this teacher
    const feedbacks = await teacherHelper.getFeedbackByTeacherId(teacher._id);

    // Fetch workspace details for each feedback
    const feedbacksWithWorkspaces = await Promise.all(feedbacks.map(async feedback => {
      const workspace = await userHelper.getWorkspaceById(ObjectId(feedback.workspaceId)); // Convert workspaceId to ObjectId
      if (workspace) {
        feedback.workspaceName = workspace.name; // Attach workspace name to feedback
      }
      return feedback;
    }));

    // Render the feedback page with teacher, feedbacks, and workspace data
    res.render("teacher/all-feedbacks", {
      teacher,  // Teacher details
      feedbacks: feedbacksWithWorkspaces // Feedback with workspace details
    });
  } catch (error) {
    console.error("Error fetching feedback and workspaces:", error);
    res.status(500).send("Server Error");
  }
});



///////ALL workspace/////////////////////                                         
router.get("/all-workspaces", verifySignedIn, function (req, res) {
  let teacher = req.session.teacher;
  teacherHelper.getAllworkspaces(req.session.teacher._id).then((workspaces) => {
    res.render("teacher/all-workspaces", { teacher: true, layout: "layout", workspaces, teacher });
  });
});

///////ADD workspace/////////////////////                                         
router.get("/add-workspace", verifySignedIn, function (req, res) {
  let teacher = req.session.teacher;
  res.render("teacher/add-workspace", { teacher: true, layout: "layout", teacher });
});

///////ADD workspace/////////////////////                                         
router.post("/add-workspace", function (req, res) {
  // Ensure the teacher is signed in and their ID is available
  if (req.session.signedInTeacher && req.session.teacher && req.session.teacher._id) {
    const teacherId = req.session.teacher._id; // Get the teacher's ID from the session

    // Pass the teacherId to the addworkspace function
    teacherHelper.addworkspace(req.body, teacherId, (workspaceId, error) => {
      if (error) {
        console.log("Error adding workspace:", error);
        res.status(500).send("Failed to add workspace");
      } else {
        let image = req.files.Image;
        image.mv("./public/images/workspace-images/" + workspaceId + ".png", (err) => {
          if (!err) {
            res.redirect("/teacher/all-workspaces");
          } else {
            console.log("Error saving workspace image:", err);
            res.status(500).send("Failed to save workspace image");
          }
        });
      }
    });
  } else {
    // If the teacher is not signed in, redirect to the sign-in page
    res.redirect("/teacher/signin");
  }
});


///////EDIT workspace/////////////////////                                         
router.get("/edit-workspace/:id", verifySignedIn, async function (req, res) {
  let teacher = req.session.teacher;
  let workspaceId = req.params.id;
  let workspace = await teacherHelper.getworkspaceDetails(workspaceId);
  console.log(workspace);
  res.render("teacher/edit-workspace", { teacher: true, layout: "layout", workspace, teacher });
});

///////EDIT workspace/////////////////////                                         
router.post("/edit-workspace/:id", verifySignedIn, function (req, res) {
  let workspaceId = req.params.id;
  teacherHelper.updateworkspace(workspaceId, req.body).then(() => {
    if (req.files) {
      let image = req.files.Image;
      if (image) {
        image.mv("./public/images/workspace-images/" + workspaceId + ".png");
      }
    }
    res.redirect("/teacher/all-workspaces");
  });
});

///////DELETE workspace/////////////////////                                         
router.get("/delete-workspace/:id", verifySignedIn, function (req, res) {
  let workspaceId = req.params.id;
  teacherHelper.deleteworkspace(workspaceId).then((response) => {
    fs.unlinkSync("./public/images/workspace-images/" + workspaceId + ".png");
    res.redirect("/teacher/all-workspaces");
  });
});

///////DELETE ALL workspace/////////////////////                                         
router.get("/delete-all-workspaces", verifySignedIn, function (req, res) {
  teacherHelper.deleteAllworkspaces().then(() => {
    res.redirect("/teacher/all-workspaces");
  });
});


router.get("/all-users", verifySignedIn, async function (req, res) {
  let teacher = req.session.teacher;


  let users = await teacherHelper.getAllUsers();

  res.render("teacher/all-users", {
    teacher: true,
    layout: "layout",
    users,
    teacher
  });
});

router.get("/all-transactions", verifySignedIn, async function (req, res) {
  let teacher = req.session.teacher;

  // Ensure you have the teacher's ID available
  let teacherId = teacher._id; // Adjust based on how teacher ID is stored in session

  // Pass teacherId to getAllOrders
  let orders = await teacherHelper.getAllOrders(teacherId);

  res.render("teacher/all-transactions", {
    teacher: true,
    layout: "layout",
    orders,
    teacher
  });
});

router.get("/pending-approval", function (req, res) {
  if (!req.session.signedInTeacher || req.session.teacher.approved) {
    res.redirect("/teacher");
  } else {
    res.render("teacher/pending-approval", {
      teacher: true, layout: "empty",
    });
  }
});


router.get("/signup", function (req, res) {
  if (req.session.signedInTeacher) {
    res.redirect("/teacher");
  } else {
    res.render("teacher/signup", {
      teacher: true, layout: "empty",
      signUpErr: req.session.signUpErr,
    });
  }
});

router.post("/signup", async function (req, res) {
  const { Companyname, Email, Phone, Address, City, Pincode, Password } = req.body;
  let errors = {};

  // Field validations
  if (!Companyname) errors.Companyname = "Please enter your company name.";
  if (!Email) errors.email = "Please enter your email.";
  if (!Phone) errors.phone = "Please enter your phone number.";
  if (!Address) errors.address = "Please enter your address.";
  if (!City) errors.city = "Please enter your city.";
  if (!Pincode) errors.pincode = "Please enter your pincode.";
  if (!Password) errors.password = "Please enter a password.";

  // Check if email or company name already exists
  const existingEmail = await db.get()
    .collection(collections.TEACHER_COLLECTION)
    .findOne({ Email });
  if (existingEmail) errors.email = "This email is already registered.";

  const existingCompanyname = await db.get()
    .collection(collections.TEACHER_COLLECTION)
    .findOne({ Companyname });
  if (existingCompanyname) errors.Companyname = "This company name is already registered.";

  // Validate Pincode and Phone
  if (!/^\d{6}$/.test(Pincode)) errors.pincode = "Pincode must be exactly 6 digits.";
  if (!/^\d{10}$/.test(Phone)) errors.phone = "Phone number must be exactly 10 digits.";
  const existingPhone = await db.get()
    .collection(collections.TEACHER_COLLECTION)
    .findOne({ Phone });
  if (existingPhone) errors.phone = "This phone number is already registered.";

  // If there are validation errors, re-render the form
  if (Object.keys(errors).length > 0) {
    return res.render("teacher/signup", {
      teacher: true,
      layout: 'empty',
      errors,
      Companyname,
      Email,
      Phone,
      Address,
      City,
      Pincode,
      Password
    });
  }

  teacherHelper.dosignup(req.body).then((response) => {
    if (!response) {
      req.session.signUpErr = "Invalid Admin Code";
      return res.redirect("/teacher/signup");
    }

    // Extract the id properly, assuming it's part of an object (like MongoDB ObjectId)
    const id = response._id ? response._id.toString() : response.toString();

    // Ensure the images directory exists
    const imageDir = "./public/images/teacher-images/";
    if (!fs.existsSync(imageDir)) {
      fs.mkdirSync(imageDir, { recursive: true });
    }

    // Handle image upload
    if (req.files && req.files.Image) {
      let image = req.files.Image;
      let imagePath = imageDir + id + ".png";  // Use the extracted id here

      console.log("Saving image to:", imagePath);  // Log the correct image path

      image.mv(imagePath, (err) => {
        if (!err) {
          // On successful image upload, redirect to pending approval
          req.session.signedInTeacher = true;
          req.session.teacher = response;
          res.redirect("/teacher/pending-approval");
        } else {
          console.log("Error saving image:", err);  // Log any errors
          res.status(500).send("Error uploading image");
        }
      });
    } else {
      // No image uploaded, proceed without it
      req.session.signedInTeacher = true;
      req.session.teacher = response;
      res.redirect("/teacher/pending-approval");
    }
  }).catch((err) => {
    console.log("Error during signup:", err);
    res.status(500).send("Error during signup");
  });
}),


  router.get("/signin", function (req, res) {
    if (req.session.signedInTeacher) {
      res.redirect("/teacher");
    } else {
      res.render("teacher/signin", {
        teacher: true, layout: "empty",
        signInErr: req.session.signInErr,
      });
      req.session.signInErr = null;
    }
  });

router.post("/signin", function (req, res) {
  const { Email, Password } = req.body;

  // Validate Email and Password
  if (!Email || !Password) {
    req.session.signInErr = "Please fill all fields.";
    return res.redirect("/teacher/signin");
  }

  teacherHelper.doSignin(req.body)
    .then((response) => {
      if (response.status === true) {
        req.session.signedInTeacher = true;
        req.session.teacher = response.teacher;
        res.redirect("/teacher");
      } else if (response.status === "pending") {
        req.session.signInErr = "This user is not approved by admin, please wait.";
        res.redirect("/teacher/signin");
      } else if (response.status === "rejected") {
        req.session.signInErr = "This user is rejected by admin.";
        res.redirect("/teacher/signin");
      } else {
        req.session.signInErr = "Invalid Email/Password";
        res.redirect("/teacher/signin");
      }
    })
    .catch((error) => {
      console.error(error);
      req.session.signInErr = "An error occurred. Please try again.";
      res.redirect("/teacher/signin");
    });
});




router.get("/signout", function (req, res) {
  req.session.signedInTeacher = false;
  req.session.teacher = null;
  res.redirect("/teacher");
});

router.get("/add-product", verifySignedIn, function (req, res) {
  let teacher = req.session.teacher;
  res.render("teacher/add-product", { teacher: true, layout: "layout", workspace });
});

router.post("/add-product", function (req, res) {
  teacherHelper.addProduct(req.body, (id) => {
    let image = req.files.Image;
    image.mv("./public/images/product-images/" + id + ".png", (err, done) => {
      if (!err) {
        res.redirect("/teacher/add-product");
      } else {
        console.log(err);
      }
    });
  });
});

router.get("/edit-product/:id", verifySignedIn, async function (req, res) {
  let teacher = req.session.teacher;
  let productId = req.params.id;
  let product = await teacherHelper.getProductDetails(productId);
  console.log(product);
  res.render("teacher/edit-product", { teacher: true, layout: "layout", product, workspace });
});

router.post("/edit-product/:id", verifySignedIn, function (req, res) {
  let productId = req.params.id;
  teacherHelper.updateProduct(productId, req.body).then(() => {
    if (req.files) {
      let image = req.files.Image;
      if (image) {
        image.mv("./public/images/product-images/" + productId + ".png");
      }
    }
    res.redirect("/teacher/all-products");
  });
});

router.get("/delete-product/:id", verifySignedIn, function (req, res) {
  let productId = req.params.id;
  teacherHelper.deleteProduct(productId).then((response) => {
    fs.unlinkSync("./public/images/product-images/" + productId + ".png");
    res.redirect("/teacher/all-products");
  });
});

router.get("/delete-all-products", verifySignedIn, function (req, res) {
  teacherHelper.deleteAllProducts().then(() => {
    res.redirect("/teacher/all-products");
  });
});

router.get("/all-users", verifySignedIn, function (req, res) {
  let teacher = req.session.teacher;
  teacherHelper.getAllUsers().then((users) => {
    res.render("teacher/users/all-users", { teacher: true, layout: "layout", workspace, users });
  });
});

router.get("/remove-user/:id", verifySignedIn, function (req, res) {
  let userId = req.params.id;
  teacherHelper.removeUser(userId).then(() => {
    res.redirect("/teacher/all-users");
  });
});

router.get("/remove-all-users", verifySignedIn, function (req, res) {
  teacherHelper.removeAllUsers().then(() => {
    res.redirect("/teacher/all-users");
  });
});

router.get("/all-orders", verifySignedIn, async function (req, res) {
  let teacher = req.session.teacher;

  // Ensure you have the teacher's ID available
  let teacherId = teacher._id; // Adjust based on how teacher ID is stored in session

  // Pass teacherId to getAllOrders
  let orders = await teacherHelper.getAllOrders(teacherId);

  res.render("teacher/all-orders", {
    teacher: true,
    layout: "layout",
    orders,
    teacher
  });
});

router.get(
  "/view-ordered-products/:id",
  verifySignedIn,
  async function (req, res) {
    let teacher = req.session.teacher;
    let orderId = req.params.id;
    let products = await userHelper.getOrderProducts(orderId);
    res.render("teacher/order-products", {
      teacher: true, layout: "layout",
      workspace,
      products,
    });
  }
);

router.get("/change-status/", verifySignedIn, function (req, res) {
  let status = req.query.status;
  let orderId = req.query.orderId;
  teacherHelper.changeStatus(status, orderId).then(() => {
    res.redirect("/teacher/all-orders");
  });
});

router.get("/cancel-order/:id", verifySignedIn, function (req, res) {
  let orderId = req.params.id;
  teacherHelper.cancelOrder(orderId).then(() => {
    res.redirect("/teacher/all-orders");
  });
});

router.get("/cancel-all-orders", verifySignedIn, function (req, res) {
  teacherHelper.cancelAllOrders().then(() => {
    res.redirect("/teacher/all-orders");
  });
});

router.post("/search", verifySignedIn, function (req, res) {
  let teacher = req.session.teacher;
  teacherHelper.searchProduct(req.body).then((response) => {
    res.render("teacher/search-result", { teacher: true, layout: "layout", workspace, response });
  });
});



///////ALL task/////////////////////                                         
router.get("/homework", verifySignedIn, function (req, res) {
  let teacher = req.session.teacher;
  teacherHelper.getAllhomeworks(req.session.teacher._id).then((homeworks) => {
    res.render("teacher/homework", { teacher: true, homeworks, teacher });
  });
});


///////ADD workspace/////////////////////                                         
router.get("/add-hw", verifySignedIn, async function (req, res) {
  let teacher = req.session.teacher; // ✅ Get the logged-in teacher's session data
  // ✅ Fetch teacher details along with the subject details using `$lookup`
  let teacherDetails = await db.get()
    .collection(collections.TEACHER_COLLECTION)
    .aggregate([
      {
        $match: { _id: new ObjectId(teacher._id) } // ✅ Match the logged-in teacher
      },
      {
        $lookup: {
          from: collections.SUBJECT_COLLECTION, // ✅ Join with SUBJECT_COLLECTION
          localField: "subject", // ✅ Match teacher's `subject` field
          foreignField: "_id", // ✅ Match `_id` from SUBJECT_COLLECTION
          as: "subjectDetails" // ✅ Store result as `subjectDetails`
        }
      },
      {
        $unwind: {
          path: "$subjectDetails", // ✅ Extract subject details (if exists)
          preserveNullAndEmptyArrays: true // ✅ Allow teachers with no subjects
        }
      }
    ])
    .toArray();

  if (teacherDetails.length > 0) {
    teacher = teacherDetails[0]; // ✅ Set the full teacher details
  }
  res.render("teacher/add-hw", { teacher: true, layout: "layout", teacher });
});

///////ADD homework/////////////////////                                         
router.post("/add-hw", function (req, res) {
  // Ensure the teacher is signed in and their ID is available
  if (req.session.signedInTeacher && req.session.teacher && req.session.teacher._id) {
    const teacherId = req.session.teacher._id; // Get the teacher's ID from the session

    // Pass the teacherId to the addhomework function
    teacherHelper.addhomework(req.body, teacherId, (homeworkId, error) => {
      if (error) {
        console.log("Error adding homework:", error);
        res.status(500).send("Failed to add homework");
      } else {
        let image = req.files.Image;
        image.mv("./public/images/homework-images/" + homeworkId + ".png", (err) => {
          if (!err) {
            res.redirect("/teacher/homework");
          } else {
            console.log("Error saving homework image:", err);
            res.status(500).send("Failed to save homework image");
          }
        });
      }
    });
  } else {
    // If the teacher is not signed in, redirect to the sign-in page
    res.redirect("/teacher/signin");
  }
});



///////ALL task/////////////////////                                         
router.get("/classes", verifySignedIn, function (req, res) {
  let teacher = req.session.teacher;
  teacherHelper.getAlltasks(req.session.teacher._id).then((tasks) => {
    res.render("teacher/classes", { teacher: true, tasks, teacher });
  });
});


///////ALL attendance class 1/////////////////////                                         
router.get("/class-1", verifySignedIn, async function (req, res) {
  let teacher = req.session.teacher;
  try {
    // ✅ Fetch teacher details along with the subject details using `$lookup`
    let teacherDetails = await db.get()
      .collection(collections.TEACHER_COLLECTION)
      .aggregate([
        {
          $match: { _id: new ObjectId(teacher._id) } // ✅ Match the logged-in teacher
        },
        {
          $lookup: {
            from: collections.SUBJECT_COLLECTION, // ✅ Join with SUBJECT_COLLECTION
            localField: "subject", // ✅ Match teacher's `subject` field
            foreignField: "_id", // ✅ Match `_id` from SUBJECT_COLLECTION
            as: "subjectDetails" // ✅ Store result as `subjectDetails`
          }
        },
        {
          $unwind: {
            path: "$subjectDetails", // ✅ Extract subject details (if exists)
            preserveNullAndEmptyArrays: true // ✅ Allow teachers with no subjects
          }
        }
      ])
      .toArray();

    if (teacherDetails.length > 0) {
      teacher = teacherDetails[0]; // ✅ Set the full teacher details
    }

    // ✅ Fetch only users where `Class = 1`
    let users = await db.get()
      .collection(collections.USERS_COLLECTION)
      .find({ Class: "1" }) // ✅ Filter users with Class = 1
      .toArray();

    res.render("teacher/classes/class-1", { teacher: true, layout: "layout", teacher, users });
  } catch (error) {
    console.error("Error fetching teacher details:", error);
    res.redirect("/login");
  }
});


///////ALL attendance class 2/////////////////////                                         
router.get("/class-2", verifySignedIn, async function (req, res) {
  let teacher = req.session.teacher;
  try {
    // ✅ Fetch teacher details along with the subject details using `$lookup`
    let teacherDetails = await db.get()
      .collection(collections.TEACHER_COLLECTION)
      .aggregate([
        {
          $match: { _id: new ObjectId(teacher._id) } // ✅ Match the logged-in teacher
        },
        {
          $lookup: {
            from: collections.SUBJECT_COLLECTION, // ✅ Join with SUBJECT_COLLECTION
            localField: "subject", // ✅ Match teacher's `subject` field
            foreignField: "_id", // ✅ Match `_id` from SUBJECT_COLLECTION
            as: "subjectDetails" // ✅ Store result as `subjectDetails`
          }
        },
        {
          $unwind: {
            path: "$subjectDetails", // ✅ Extract subject details (if exists)
            preserveNullAndEmptyArrays: true // ✅ Allow teachers with no subjects
          }
        }
      ])
      .toArray();

    if (teacherDetails.length > 0) {
      teacher = teacherDetails[0]; // ✅ Set the full teacher details
    }

    // ✅ Fetch only users where `Class = 1`
    let users = await db.get()
      .collection(collections.USERS_COLLECTION)
      .find({ Class: "2" }) // ✅ Filter users with Class = 1
      .toArray();

    res.render("teacher/classes/class-2", { teacher: true, layout: "layout", teacher, users });
  } catch (error) {
    console.error("Error fetching teacher details:", error);
    res.redirect("/login");
  }
});


///////ALL attendance class 3/////////////////////                                         
router.get("/class-3", verifySignedIn, async function (req, res) {
  let teacher = req.session.teacher;
  try {
    // ✅ Fetch teacher details along with the subject details using `$lookup`
    let teacherDetails = await db.get()
      .collection(collections.TEACHER_COLLECTION)
      .aggregate([
        {
          $match: { _id: new ObjectId(teacher._id) } // ✅ Match the logged-in teacher
        },
        {
          $lookup: {
            from: collections.SUBJECT_COLLECTION, // ✅ Join with SUBJECT_COLLECTION
            localField: "subject", // ✅ Match teacher's `subject` field
            foreignField: "_id", // ✅ Match `_id` from SUBJECT_COLLECTION
            as: "subjectDetails" // ✅ Store result as `subjectDetails`
          }
        },
        {
          $unwind: {
            path: "$subjectDetails", // ✅ Extract subject details (if exists)
            preserveNullAndEmptyArrays: true // ✅ Allow teachers with no subjects
          }
        }
      ])
      .toArray();

    if (teacherDetails.length > 0) {
      teacher = teacherDetails[0]; // ✅ Set the full teacher details
    }

    // ✅ Fetch only users where `Class = 1`
    let users = await db.get()
      .collection(collections.USERS_COLLECTION)
      .find({ Class: "3" }) // ✅ Filter users with Class = 1
      .toArray();

    res.render("teacher/classes/class-3", { teacher: true, layout: "layout", teacher, users });
  } catch (error) {
    console.error("Error fetching teacher details:", error);
    res.redirect("/login");
  }
});



///////ALL attendance class 4/////////////////////                                         
router.get("/class-4", verifySignedIn, async function (req, res) {
  let teacher = req.session.teacher;
  try {
    // ✅ Fetch teacher details along with the subject details using `$lookup`
    let teacherDetails = await db.get()
      .collection(collections.TEACHER_COLLECTION)
      .aggregate([
        {
          $match: { _id: new ObjectId(teacher._id) } // ✅ Match the logged-in teacher
        },
        {
          $lookup: {
            from: collections.SUBJECT_COLLECTION, // ✅ Join with SUBJECT_COLLECTION
            localField: "subject", // ✅ Match teacher's `subject` field
            foreignField: "_id", // ✅ Match `_id` from SUBJECT_COLLECTION
            as: "subjectDetails" // ✅ Store result as `subjectDetails`
          }
        },
        {
          $unwind: {
            path: "$subjectDetails", // ✅ Extract subject details (if exists)
            preserveNullAndEmptyArrays: true // ✅ Allow teachers with no subjects
          }
        }
      ])
      .toArray();

    if (teacherDetails.length > 0) {
      teacher = teacherDetails[0]; // ✅ Set the full teacher details
    }

    // ✅ Fetch only users where `Class = 1`
    let users = await db.get()
      .collection(collections.USERS_COLLECTION)
      .find({ Class: "4" }) // ✅ Filter users with Class = 1
      .toArray();

    res.render("teacher/classes/class-4", { teacher: true, layout: "layout", teacher, users });
  } catch (error) {
    console.error("Error fetching teacher details:", error);
    res.redirect("/login");
  }
});



///////ALL attendance class 5/////////////////////                                         
router.get("/class-5", verifySignedIn, async function (req, res) {
  let teacher = req.session.teacher;
  try {
    // ✅ Fetch teacher details along with the subject details using `$lookup`
    let teacherDetails = await db.get()
      .collection(collections.TEACHER_COLLECTION)
      .aggregate([
        {
          $match: { _id: new ObjectId(teacher._id) } // ✅ Match the logged-in teacher
        },
        {
          $lookup: {
            from: collections.SUBJECT_COLLECTION, // ✅ Join with SUBJECT_COLLECTION
            localField: "subject", // ✅ Match teacher's `subject` field
            foreignField: "_id", // ✅ Match `_id` from SUBJECT_COLLECTION
            as: "subjectDetails" // ✅ Store result as `subjectDetails`
          }
        },
        {
          $unwind: {
            path: "$subjectDetails", // ✅ Extract subject details (if exists)
            preserveNullAndEmptyArrays: true // ✅ Allow teachers with no subjects
          }
        }
      ])
      .toArray();

    if (teacherDetails.length > 0) {
      teacher = teacherDetails[0]; // ✅ Set the full teacher details
    }

    // ✅ Fetch only users where `Class = 1`
    let users = await db.get()
      .collection(collections.USERS_COLLECTION)
      .find({ Class: "5" }) // ✅ Filter users with Class = 1
      .toArray();

    res.render("teacher/classes/class-5", { teacher: true, layout: "layout", teacher, users });
  } catch (error) {
    console.error("Error fetching teacher details:", error);
    res.redirect("/login");
  }
});


///////ALL attendance class 6/////////////////////                                         
router.get("/class-6", verifySignedIn, async function (req, res) {
  let teacher = req.session.teacher;
  try {
    // ✅ Fetch teacher details along with the subject details using `$lookup`
    let teacherDetails = await db.get()
      .collection(collections.TEACHER_COLLECTION)
      .aggregate([
        {
          $match: { _id: new ObjectId(teacher._id) } // ✅ Match the logged-in teacher
        },
        {
          $lookup: {
            from: collections.SUBJECT_COLLECTION, // ✅ Join with SUBJECT_COLLECTION
            localField: "subject", // ✅ Match teacher's `subject` field
            foreignField: "_id", // ✅ Match `_id` from SUBJECT_COLLECTION
            as: "subjectDetails" // ✅ Store result as `subjectDetails`
          }
        },
        {
          $unwind: {
            path: "$subjectDetails", // ✅ Extract subject details (if exists)
            preserveNullAndEmptyArrays: true // ✅ Allow teachers with no subjects
          }
        }
      ])
      .toArray();

    if (teacherDetails.length > 0) {
      teacher = teacherDetails[0]; // ✅ Set the full teacher details
    }

    // ✅ Fetch only users where `Class = 1`
    let users = await db.get()
      .collection(collections.USERS_COLLECTION)
      .find({ Class: "6" }) // ✅ Filter users with Class = 1
      .toArray();

    res.render("teacher/classes/class-6", { teacher: true, layout: "layout", teacher, users });
  } catch (error) {
    console.error("Error fetching teacher details:", error);
    res.redirect("/login");
  }
});


///////ALL attendance class 7/////////////////////                                         
router.get("/class-7", verifySignedIn, async function (req, res) {
  let teacher = req.session.teacher;
  try {
    // ✅ Fetch teacher details along with the subject details using `$lookup`
    let teacherDetails = await db.get()
      .collection(collections.TEACHER_COLLECTION)
      .aggregate([
        {
          $match: { _id: new ObjectId(teacher._id) } // ✅ Match the logged-in teacher
        },
        {
          $lookup: {
            from: collections.SUBJECT_COLLECTION, // ✅ Join with SUBJECT_COLLECTION
            localField: "subject", // ✅ Match teacher's `subject` field
            foreignField: "_id", // ✅ Match `_id` from SUBJECT_COLLECTION
            as: "subjectDetails" // ✅ Store result as `subjectDetails`
          }
        },
        {
          $unwind: {
            path: "$subjectDetails", // ✅ Extract subject details (if exists)
            preserveNullAndEmptyArrays: true // ✅ Allow teachers with no subjects
          }
        }
      ])
      .toArray();

    if (teacherDetails.length > 0) {
      teacher = teacherDetails[0]; // ✅ Set the full teacher details
    }

    // ✅ Fetch only users where `Class = 1`
    let users = await db.get()
      .collection(collections.USERS_COLLECTION)
      .find({ Class: "7" }) // ✅ Filter users with Class = 1
      .toArray();

    res.render("teacher/classes/class-7", { teacher: true, layout: "layout", teacher, users });
  } catch (error) {
    console.error("Error fetching teacher details:", error);
    res.redirect("/login");
  }
});


///////ALL material/////////////////////                                         
router.get("/timetable", verifySignedIn, async function (req, res) {
  let teacher = req.session.teacher;
  let timetablesc1 = await adminHelper.getAllTimetablesC1();
  let timetablesc2 = await adminHelper.getAllTimetablesC2();
  let timetablesc3 = await adminHelper.getAllTimetablesC3();
  let timetablesc4 = await adminHelper.getAllTimetablesC4();
  let timetablesc5 = await adminHelper.getAllTimetablesC5();
  let timetablesc6 = await adminHelper.getAllTimetablesC6();
  let timetablesc7 = await adminHelper.getAllTimetablesC7();

  res.render("teacher/timetable", { teacher: true, teacher, timetablesc1, timetablesc2, timetablesc3, timetablesc4, timetablesc5, timetablesc6, timetablesc7, });
});




router.get("/all-attendance", verifySignedIn, function (req, res) {
  let teacher = req.session.teacher;
  teacherHelper.getAllattendancesbyId(teacher._id).then((attendances) => {
    res.render("teacher/all-attendance", { teacher: true, attendances, teacher });
  }).catch((err) => {
    console.error("Error fetching attendance:", err);
    res.status(500).send("Internal Server Error");
  });
});





router.get("/all-exam", verifySignedIn, function (req, res) {
  let teacher = req.session.teacher;
  teacherHelper.getexamById(teacher._id).then((exams) => {
    res.render("teacher/all-exam", { teacher: true, exams, teacher });
  }).catch((err) => {
    console.error("Error fetching exam:", err);
    res.status(500).send("Internal Server Error");
  });
});


router.get("/add-exam", verifySignedIn, function (req, res) {
  let teacher = req.session.teacher;
  res.render("teacher/add-exam", { teacher: true, teacher });
});



router.post("/add-exam", function (req, res) {
  if (req.session.signedInTeacher && req.session.teacher && req.session.teacher._id) {
    const teacherId = req.session.teacher._id;

    teacherHelper.addexam(req.body, teacherId, (examId, error) => {
      if (error) {
        console.log("Error adding exam:", error);
        return res.status(500).send("Failed to add exam");
      }

      // Redirect to the all exams page after adding the exam
      res.redirect("/teacher/all-exam");
    });
  } else {
    res.redirect("/teacher/signin");
  }
});

router.get("/delete-exam/:id", verifySignedIn, function (req, res) {
  let examId = req.params.id;
  teacherHelper.deleteexam(examId).then((response) => {
    res.redirect("/teacher/all-exam");
  });
});




module.exports = router;
