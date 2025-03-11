var db = require("../config/connection");
var collections = require("../config/collections");
const bcrypt = require("bcrypt");
const objectId = require("mongodb").ObjectID;
const Razorpay = require("razorpay");
const ObjectId = require('mongodb').ObjectId; // Required to convert string to ObjectId


var instance = new Razorpay({
  key_id: "rzp_test_8NokNgt8cA3Hdv",
  key_secret: "xPzG53EXxT8PKr34qT7CTFm9",
});

module.exports = {


  getAllmaterials: () => {
    return new Promise(async (resolve, reject) => {
      try {
        let materials = await db
          .get()
          .collection(collections.MATERIAL_COLLECTION)
          .aggregate([
            {
              $lookup: {
                from: collections.TEACHER_COLLECTION,
                localField: "teacherId",
                foreignField: "_id",
                as: "teacherDetails",
              },
            },
            {
              $unwind: {
                path: "$teacherDetails",
                preserveNullAndEmptyArrays: true, // If no matching teacher, it won't break
              },
            },
            {
              $lookup: {
                from: collections.SUBJECT_COLLECTION, // Assuming subjects are stored in a separate collection
                localField: "teacherDetails.subject",
                foreignField: "_id",
                as: "subjectDetails",
              },
            },
            {
              $unwind: {
                path: "$subjectDetails",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $project: {
                _id: 1,
                materialName: 1,
                name: 1,
                desc: 1,
                no: 1,
                date: 1,
                teacher: "$teacherDetails.Companyname", // Fetching teacher name
                subject: "$subjectDetails.sname", // Fetching subject name
              },
            },
          ])
          .toArray();

        resolve(materials);
      } catch (error) {
        reject(error);
      }
    });
  },


  getAllanouncements: () => {
    return new Promise(async (resolve, reject) => {

      let anouncements = await db
        .get()
        .collection(collections.ANOUNCEMENTS_COLLECTION)
        .find()
        .toArray();
      resolve(anouncements);
    });
  },

  getAlltasks: () => {
    return new Promise(async (resolve, reject) => {
      try {
        let tasks = await db
          .get()
          .collection(collections.TASK_COLLECTION)
          .aggregate([
            {
              $lookup: {
                from: collections.TEACHER_COLLECTION,
                localField: "teacherId",
                foreignField: "_id",
                as: "teacherDetails",
              },
            },
            {
              $unwind: {
                path: "$teacherDetails",
                preserveNullAndEmptyArrays: true, // If no matching teacher, it won't break
              },
            },
            {
              $lookup: {
                from: collections.SUBJECT_COLLECTION, // Assuming subjects are stored in a separate collection
                localField: "teacherDetails.subject",
                foreignField: "_id",
                as: "subjectDetails",
              },
            },
            {
              $unwind: {
                path: "$subjectDetails",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $project: {
                _id: 1,
                materialName: 1,
                name: 1,
                note: 1,
                req: 1,
                deadline: 1,
                no: 1,
                date: 1,
                teacher: "$teacherDetails.Companyname", // Fetching teacher name
                subject: "$subjectDetails.sname", // Fetching subject name
              },
            },
          ])
          .toArray();

        resolve(tasks);
      } catch (error) {
        reject(error);
      }
    });
  },




  getAllhomeworks: () => {
    return new Promise(async (resolve, reject) => {
      try {
        let homeworks = await db
          .get()
          .collection(collections.HOMEWORK_COLLECTION)
          .aggregate([
            {
              $lookup: {
                from: collections.TEACHER_COLLECTION,
                localField: "teacherId",
                foreignField: "_id",
                as: "teacherDetails",
              },
            },
            {
              $unwind: {
                path: "$teacherDetails",
                preserveNullAndEmptyArrays: true, // If no matching teacher, it won't break
              },
            },
            {
              $lookup: {
                from: collections.SUBJECT_COLLECTION, // Assuming subjects are stored in a separate collection
                localField: "teacherDetails.subject",
                foreignField: "_id",
                as: "subjectDetails",
              },
            },
            {
              $unwind: {
                path: "$subjectDetails",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $project: {
                _id: 1,
                materialName: 1,
                name: 1,
                note: 1,
                req: 1,
                deadline: 1,
                no: 1,
                date: 1,
                teacher: "$teacherDetails.Companyname", // Fetching teacher name
                subject: "$subjectDetails.sname", // Fetching subject name
              },
            },
          ])
          .toArray();

        resolve(homeworks);
      } catch (error) {
        reject(error);
      }
    });
  },



  ///////All Attendance by id/////////////////////                                         
  getAllattendancebyid: (userId) => {  // Accept userId as a parameter
    return new Promise(async (resolve, reject) => {
      try {
        let attendance = await db
          .get()
          .collection(collections.ATTENDANCE_COLLECTION)
          .aggregate([
            {
              // Filter attendance for the logged-in user
              $match: {
                selectedUsers: new ObjectId(userId)  // ✅ Match userId in the selectedUsers array
              }
            },
            {
              // Lookup for teacher details
              $lookup: {
                from: collections.TEACHER_COLLECTION,
                localField: "teacherId",
                foreignField: "_id",
                as: "teacherDetails"
              }
            },
            {
              // Unwind teacherDetails to extract a single teacher object
              $unwind: {
                path: "$teacherDetails",
                preserveNullAndEmptyArrays: true
              }
            },
            {
              // Lookup for subject details
              $lookup: {
                from: collections.SUBJECT_COLLECTION,
                localField: "subjectId",
                foreignField: "_id",
                as: "subjectDetails"
              }
            },
            {
              // Unwind subjectDetails to extract a single subject object
              $unwind: {
                path: "$subjectDetails",
                preserveNullAndEmptyArrays: true
              }
            },
            {
              // Lookup for selected user details
              $lookup: {
                from: collections.USERS_COLLECTION,
                localField: "selectedUsers",
                foreignField: "_id",
                as: "selectedUserDetails"
              }
            },
            {
              // Project necessary fields
              $project: {
                date: 1,
                subject: 1,
                teacherName: { $ifNull: ["$teacherDetails.Name", ""] },
                subjectName: { $ifNull: ["$subjectDetails.sname", ""] },
                selectedUsers: "$selectedUserDetails.Fname",  // User's first name from selected users
              }
            }
          ])
          .toArray();

        resolve(attendance);
      } catch (err) {
        console.error("Error fetching attendance:", err);
        reject(err);
      }
    });
  },

  getnotificationById: (userId) => {
    return new Promise(async (resolve, reject) => {
      try {
        // Fetch notifications based on userId (converted to ObjectId)
        const notifications = await db.get()
          .collection(collections.NOTIFICATIONS_STD_COLLECTION)
          .find({ userId: ObjectId(userId) }) // Filter by logged-in userId
          .toArray();

        resolve(notifications);
      } catch (error) {
        reject(error);
      }
    });
  },


  addFeedback: (feedback) => {
    return new Promise(async (resolve, reject) => {
      try {
        await db.get()
          .collection(collections.FEEDBACK_COLLECTION)
          .insertOne(feedback);
        resolve(); // Resolve the promise on success
      } catch (error) {
        reject(error); // Reject the promise on error
      }
    });
  },


  getFeedbackByHomeworkId: (homeworkId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const feedbacks = await db.get()
          .collection(collections.FEEDBACK_COLLECTION)
          .find({ homeworkId: ObjectId(homeworkId) }) // Convert taskId to ObjectId
          .toArray();

        resolve(feedbacks);
      } catch (error) {
        reject(error);
      }
    });
  },


  getFeedbackByTaskId: (taskId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const feedbacks = await db.get()
          .collection(collections.FEEDBACK_COLLECTION)
          .find({ taskId: ObjectId(taskId) }) // Convert taskId to ObjectId
          .toArray();

        resolve(feedbacks);
      } catch (error) {
        reject(error);
      }
    });
  },


  getTeacherById: (teacherId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const teacher = await db.get()
          .collection(collections.TEACHER_COLLECTION)
          .findOne({ _id: ObjectId(teacherId) });
        resolve(teacher);
      } catch (error) {
        reject(error);
      }
    });
  },








  ///////GET ALL task/////////////////////     

  getAlltasks: () => {
    return new Promise(async (resolve, reject) => {
      let tasks = await db
        .get()
        .collection(collections.TASK_COLLECTION)
        .find()
        .toArray();
      resolve(tasks);
    });
  },

  getTaskById: (taskId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const task = await db.get()
          .collection(collections.TASK_COLLECTION)
          .findOne({ _id: ObjectId(taskId) }); // Convert taskId to ObjectId
        resolve(task);
      } catch (error) {
        reject(error);
      }
    });
  },


  getHomeworkById: (homeworkId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const homework = await db.get()
          .collection(collections.HOMEWORK_COLLECTION)
          .findOne({ _id: ObjectId(homeworkId) }); // Convert homeworkId to ObjectId
        resolve(homework);
      } catch (error) {
        reject(error);
      }
    });
  },

  // getAlltasks: (teacherId) => {
  //   return new Promise(async (resolve, reject) => {
  //     let tasks = await db
  //       .get()
  //       .collection(collections.TASK_COLLECTION)
  //       .find({ teacherId: objectId(teacherId) }) // Filter by teacherId
  //       .toArray();
  //     resolve(tasks);
  //   });
  // },

  /////// task DETAILS/////////////////////                                            
  gettaskDetails: (taskId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.TASK_COLLECTION)
        .findOne({
          _id: objectId(taskId)
        })
        .then((response) => {
          resolve(response);
        });
    });
  },

  getAllProducts: () => {
    return new Promise(async (resolve, reject) => {
      let products = await db
        .get()
        .collection(collections.PRODUCTS_COLLECTION)
        .find()
        .toArray();
      resolve(products);
    });
  },

  doSignup: (userData) => {
    return new Promise(async (resolve, reject) => {
      try {
        // Hash the password
        userData.Password = await bcrypt.hash(userData.Password, 10);

        // Set default values
        userData.isDisable = false;  // User is not disabled by default
        userData.createdAt = new Date();  // Set createdAt to the current date and time

        // Insert the user into the database
        db.get()
          .collection(collections.USERS_COLLECTION)
          .insertOne(userData)
          .then((data) => {
            // Resolve with the inserted user data
            resolve(data.ops[0]);
          })
          .catch((err) => {
            // Reject with any error during insertion
            reject(err);
          });
      } catch (err) {
        reject(err);  // Reject in case of any error during password hashing
      }
    });
  },

  doSignin: (userData) => {
    return new Promise(async (resolve, reject) => {
      let response = {};

      // Find user by email
      let user = await db
        .get()
        .collection(collections.USERS_COLLECTION)
        .findOne({ Email: userData.Email });

      // If user exists, check if the account is disabled
      if (user) {
        if (user.isDisable) {
          // If the account is disabled, return the msg from the user collection
          response.status = false;
          response.msg = user.blockReason || "Your account has been disabled.";
          return resolve(response);
        }

        // Compare passwords
        bcrypt.compare(userData.Password, user.Password).then((status) => {
          if (status) {
            console.log("Login Success");
            response.user = user;
            response.status = true;
            resolve(response);  // Successful login
          } else {
            console.log("Login Failed");
            resolve({ status: false });  // Invalid password
          }
        });
      } else {
        console.log("Login Failed");
        resolve({ status: false });  // User not found
      }
    });
  },

  getUserDetails: (userId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.USERS_COLLECTION)
        .findOne({ _id: objectId(userId) })
        .then((user) => {
          resolve(user);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  updateUserProfile: (userId, userDetails) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.USERS_COLLECTION)
        .updateOne(
          { _id: objectId(userId) },
          {
            $set: {
              Fname: userDetails.Fname,
              Lname: userDetails.Lname,
              Email: userDetails.Email,
              Phone: userDetails.Phone,
              Address: userDetails.Address,
              District: userDetails.District,
              Pincode: userDetails.Pincode,

              Pname: userDetails.Pname,
              Blood: userDetails.Blood,
              language: userDetails.language,

            },
          }
        )
        .then((response) => {
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    });
  },


  getTotalAmount: (userId) => {
    return new Promise(async (resolve, reject) => {
      let total = await db
        .get()
        .collection(collections.CART_COLLECTION)
        .aggregate([
          {
            $match: { user: objectId(userId) },
          },
          {
            $unwind: "$products",
          },
          {
            $project: {
              item: "$products.item",
              quantity: "$products.quantity",
            },
          },
          {
            $lookup: {
              from: collections.PRODUCTS_COLLECTION,
              localField: "item",
              foreignField: "_id",
              as: "product",
            },
          },
          {
            $project: {
              item: 1,
              quantity: 1,
              product: { $arrayElemAt: ["$product", 0] },
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: { $multiply: ["$quantity", "$product.Price"] } },
            },
          },
        ])
        .toArray();
      console.log(total[0].total);
      resolve(total[0].total);
    });
  },




  getTaskDetails: (taskId) => {
    return new Promise((resolve, reject) => {
      if (!ObjectId.isValid(taskId)) {
        reject(new Error('Invalid task ID format'));
        return;
      }

      db.get()
        .collection(collections.TASK_COLLECTION)
        .findOne({ _id: ObjectId(taskId) })
        .then((task) => {
          if (!task) {
            reject(new Error('Task not found'));
          } else {
            // Assuming the task has a teacherId field
            resolve(task);
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  },




  placeOrder: (order, task, total, user) => {
    return new Promise(async (resolve, reject) => {
      try {
        console.log(order, task, total);
        let status = order["payment-method"] === "COD" ? "placed" : "pending";

        // Get the task document to check the current seat value
        const taskDoc = await db.get()
          .collection(collections.TASK_COLLECTION)
          .findOne({ _id: objectId(task._id) });

        // Check if the task exists and the seat field is present
        if (!taskDoc || !taskDoc.seat) {
          return reject(new Error("Task not found or seat field is missing."));
        }

        // Convert seat from string to number and check availability
        let seatCount = Number(taskDoc.seat);
        if (isNaN(seatCount) || seatCount <= 0) {
          return reject(new Error("Seat is not available."));
        }

        // Create the order object
        let orderObject = {
          deliveryDetails: {
            Fname: order.Fname,
            Lname: order.Lname,
            Email: order.Email,
            Phone: order.Phone,
            Address: order.Address,
            District: order.District,
            State: order.State,
            Pincode: order.Pincode,
            selecteddate: order.selecteddate,
          },
          userId: objectId(order.userId),
          user: user,
          paymentMethod: order["payment-method"],
          task: task,
          totalAmount: total,
          status: status,
          date: new Date(),
          teacherId: task.teacherId, // Store the teacher's ID
        };

        // Insert the order into the database
        const response = await db.get()
          .collection(collections.ORDER_COLLECTION)
          .insertOne(orderObject);

        // Decrement the seat count
        seatCount -= 1; // Decrement the seat count

        // Convert back to string and update the task seat count
        await db.get()
          .collection(collections.TASK_COLLECTION)
          .updateOne(
            { _id: objectId(task._id) },
            { $set: { seat: seatCount.toString() } } // Convert number back to string
          );

        resolve(response.ops[0]._id);
      } catch (error) {
        console.error("Error placing order:", error);
        reject(error);
      }
    });
  },


  getUserOrder: (userId) => {
    return new Promise(async (resolve, reject) => {
      try {
        let orders = await db
          .get()
          .collection(collections.ORDER_COLLECTION)
          .find({ userId: ObjectId(userId) }) // Use 'userId' directly, not inside 'orderObject'
          .toArray();

        resolve(orders);
      } catch (error) {
        reject(error);
      }
    });
  },

  getOrderTasks: (orderId) => {
    return new Promise(async (resolve, reject) => {
      try {
        let tasks = await db
          .get()
          .collection(collections.ORDER_COLLECTION)
          .aggregate([
            {
              $match: { _id: objectId(orderId) }, // Match the order by its ID
            },
            {
              $project: {
                // Include task, user, and other relevant fields
                task: 1,
                user: 1,
                paymentMethod: 1,
                totalAmount: 1,
                status: 1,
                date: 1,
                deliveryDetails: 1, // Add deliveryDetails to the projection

              },
            },
          ])
          .toArray();

        resolve(tasks[0]); // Fetch the first (and likely only) order matching this ID
      } catch (error) {
        reject(error);
      }
    });
  },


  getTaskById: (taskId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const task = await db.get()
          .collection(collections.TASK_COLLECTION)
          .findOne({ _id: ObjectId(taskId) });
        resolve(task);
      } catch (error) {
        reject(error);
      }
    });
  },

  generateRazorpay: (orderId, totalPrice) => {
    return new Promise((resolve, reject) => {
      var options = {
        amount: totalPrice * 100, // amount in the smallest currency unit
        currency: "INR",
        receipt: "" + orderId,
      };
      instance.orders.create(options, function (err, order) {
        console.log("New Order : ", order);
        resolve(order);
      });
    });
  },

  verifyPayment: (details) => {
    return new Promise((resolve, reject) => {
      const crypto = require("crypto");
      let hmac = crypto.createHmac("sha256", "xPzG53EXxT8PKr34qT7CTFm9");

      hmac.update(
        details["payment[razorpay_order_id]"] +
        "|" +
        details["payment[razorpay_payment_id]"]
      );
      hmac = hmac.digest("hex");

      if (hmac == details["payment[razorpay_signature]"]) {
        resolve();
      } else {
        reject();
      }
    });
  },

  changePaymentStatus: (orderId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.ORDER_COLLECTION)
        .updateOne(
          { _id: objectId(orderId) },
          {
            $set: {
              "orderObject.status": "placed",
            },
          }
        )
        .then(() => {
          resolve();
        });
    });
  },

  cancelOrder: (orderId) => {
    return new Promise(async (resolve, reject) => {
      db.get()
        .collection(collections.ORDER_COLLECTION)
        .removeOne({ _id: objectId(orderId) })
        .then(() => {
          resolve();
        });
    });
  },

  searchProduct: (details) => {
    console.log(details);
    return new Promise(async (resolve, reject) => {
      db.get()
        .collection(collections.PRODUCTS_COLLECTION)
        .createIndex({ Name: "text" }).then(async () => {
          let result = await db
            .get()
            .collection(collections.PRODUCTS_COLLECTION)
            .find({
              $text: {
                $search: details.search,
              },
            })
            .toArray();
          resolve(result);
        })

    });
  },
};
