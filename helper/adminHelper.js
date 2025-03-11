var db = require("../config/connection");
var collections = require("../config/collections");
var bcrypt = require("bcrypt");
const objectId = require("mongodb").ObjectID;
const { ObjectId } = require('mongodb'); // Import ObjectId for MongoDB

module.exports = {


  getAllTimetables: () => {
    return new Promise(async (resolve, reject) => {
      try {
        let timetables = await db
          .get()
          .collection(collections.TIMETABLE_COLLECTION)
          .aggregate([
            {
              $lookup: {
                from: collections.TEACHER_COLLECTION,
                localField: "teacher1",
                foreignField: "_id",
                as: "teacherInfo1",
              },
            },
            {
              $lookup: {
                from: collections.TEACHER_COLLECTION,
                localField: "teacher2",
                foreignField: "_id",
                as: "teacherInfo2",
              },
            },
            {
              $lookup: {
                from: collections.TEACHER_COLLECTION,
                localField: "teacher3",
                foreignField: "_id",
                as: "teacherInfo3",
              },
            },
            {
              $lookup: {
                from: collections.TEACHER_COLLECTION,
                localField: "teacher4",
                foreignField: "_id",
                as: "teacherInfo4",
              },
            },
            {
              $lookup: {
                from: collections.TEACHER_COLLECTION,
                localField: "teacher5",
                foreignField: "_id",
                as: "teacherInfo5",
              },
            },
            {
              $lookup: {
                from: collections.TEACHER_COLLECTION,
                localField: "teacher6",
                foreignField: "_id",
                as: "teacherInfo6",
              },
            },
            {
              $project: {
                _id: 1,
                sname: 1,
                scode: 1,
                day: 1,
                Class: 1,
                teacher1: 1,
                teacher2: 1,
                teacher3: 1,
                teacher4: 1,
                teacher5: 1,
                teacher6: 1,
              },
            },
          ])
          .toArray();

        resolve(timetables);
      } catch (error) {
        reject(error);
      }
    });
  },



  getAllTimetablesC1: () => {
    return new Promise(async (resolve, reject) => {
      try {
        let timetables = await db
          .get()
          .collection(collections.TIMETABLE_COLLECTION)
          .aggregate([
            {
              $match: { Class: "1" }
            },
            {
              $lookup: {
                from: collections.TEACHER_COLLECTION,
                localField: "teacher1",
                foreignField: "_id",
                as: "teacherInfo1",
              },
            },
            {
              $lookup: {
                from: collections.TEACHER_COLLECTION,
                localField: "teacher2",
                foreignField: "_id",
                as: "teacherInfo2",
              },
            },
            {
              $lookup: {
                from: collections.TEACHER_COLLECTION,
                localField: "teacher3",
                foreignField: "_id",
                as: "teacherInfo3",
              },
            },
            {
              $lookup: {
                from: collections.TEACHER_COLLECTION,
                localField: "teacher4",
                foreignField: "_id",
                as: "teacherInfo4",
              },
            },
            {
              $lookup: {
                from: collections.TEACHER_COLLECTION,
                localField: "teacher5",
                foreignField: "_id",
                as: "teacherInfo5",
              },
            },
            {
              $lookup: {
                from: collections.TEACHER_COLLECTION,
                localField: "teacher6",
                foreignField: "_id",
                as: "teacherInfo6",
              },
            },
            {
              $project: {
                _id: 1,
                sname: 1,
                scode: 1,
                day: 1,
                teacher1: 1,
                teacher2: 1,
                teacher3: 1,
                teacher4: 1,
                teacher5: 1,
                teacher6: 1,
              },
            },
          ])
          .toArray();

        resolve(timetables);
      } catch (error) {
        reject(error);
      }
    });
  },

  getAllTimetablesC2: () => {
    return new Promise(async (resolve, reject) => {
      try {
        let timetables = await db
          .get()
          .collection(collections.TIMETABLE_COLLECTION)
          .aggregate([
            {
              $match: { Class: "2" }
            },
            {
              $lookup: {
                from: collections.TEACHER_COLLECTION,
                localField: "teacher1",
                foreignField: "_id",
                as: "teacherInfo1",
              },
            },
            {
              $lookup: {
                from: collections.TEACHER_COLLECTION,
                localField: "teacher2",
                foreignField: "_id",
                as: "teacherInfo2",
              },
            },
            {
              $lookup: {
                from: collections.TEACHER_COLLECTION,
                localField: "teacher3",
                foreignField: "_id",
                as: "teacherInfo3",
              },
            },
            {
              $lookup: {
                from: collections.TEACHER_COLLECTION,
                localField: "teacher4",
                foreignField: "_id",
                as: "teacherInfo4",
              },
            },
            {
              $lookup: {
                from: collections.TEACHER_COLLECTION,
                localField: "teacher5",
                foreignField: "_id",
                as: "teacherInfo5",
              },
            },
            {
              $lookup: {
                from: collections.TEACHER_COLLECTION,
                localField: "teacher6",
                foreignField: "_id",
                as: "teacherInfo6",
              },
            },
            {
              $project: {
                _id: 1,
                sname: 1,
                scode: 1,
                day: 1,
                teacher1: 1,
                teacher2: 1,
                teacher3: 1,
                teacher4: 1,
                teacher5: 1,
                teacher6: 1,
              },
            },
          ])
          .toArray();

        resolve(timetables);
      } catch (error) {
        reject(error);
      }
    });
  },



  getAllTimetablesC3: () => {
    return new Promise(async (resolve, reject) => {
      try {
        let timetables = await db
          .get()
          .collection(collections.TIMETABLE_COLLECTION)
          .aggregate([
            {
              $match: { Class: "3" }
            },
            {
              $lookup: {
                from: collections.TEACHER_COLLECTION,
                localField: "teacher1",
                foreignField: "_id",
                as: "teacherInfo1",
              },
            },
            {
              $lookup: {
                from: collections.TEACHER_COLLECTION,
                localField: "teacher2",
                foreignField: "_id",
                as: "teacherInfo2",
              },
            },
            {
              $lookup: {
                from: collections.TEACHER_COLLECTION,
                localField: "teacher3",
                foreignField: "_id",
                as: "teacherInfo3",
              },
            },
            {
              $lookup: {
                from: collections.TEACHER_COLLECTION,
                localField: "teacher4",
                foreignField: "_id",
                as: "teacherInfo4",
              },
            },
            {
              $lookup: {
                from: collections.TEACHER_COLLECTION,
                localField: "teacher5",
                foreignField: "_id",
                as: "teacherInfo5",
              },
            },
            {
              $lookup: {
                from: collections.TEACHER_COLLECTION,
                localField: "teacher6",
                foreignField: "_id",
                as: "teacherInfo6",
              },
            },
            {
              $project: {
                _id: 1,
                sname: 1,
                scode: 1,
                day: 1,
                teacher1: 1,
                teacher2: 1,
                teacher3: 1,
                teacher4: 1,
                teacher5: 1,
                teacher6: 1,
              },
            },
          ])
          .toArray();

        resolve(timetables);
      } catch (error) {
        reject(error);
      }
    });
  },



  getAllTimetablesC4: () => {
    return new Promise(async (resolve, reject) => {
      try {
        let timetables = await db
          .get()
          .collection(collections.TIMETABLE_COLLECTION)
          .aggregate([
            {
              $match: { Class: "4" }
            },
            {
              $lookup: {
                from: collections.TEACHER_COLLECTION,
                localField: "teacher1",
                foreignField: "_id",
                as: "teacherInfo1",
              },
            },
            {
              $lookup: {
                from: collections.TEACHER_COLLECTION,
                localField: "teacher2",
                foreignField: "_id",
                as: "teacherInfo2",
              },
            },
            {
              $lookup: {
                from: collections.TEACHER_COLLECTION,
                localField: "teacher3",
                foreignField: "_id",
                as: "teacherInfo3",
              },
            },
            {
              $lookup: {
                from: collections.TEACHER_COLLECTION,
                localField: "teacher4",
                foreignField: "_id",
                as: "teacherInfo4",
              },
            },
            {
              $lookup: {
                from: collections.TEACHER_COLLECTION,
                localField: "teacher5",
                foreignField: "_id",
                as: "teacherInfo5",
              },
            },
            {
              $lookup: {
                from: collections.TEACHER_COLLECTION,
                localField: "teacher6",
                foreignField: "_id",
                as: "teacherInfo6",
              },
            },
            {
              $project: {
                _id: 1,
                sname: 1,
                scode: 1,
                day: 1,
                teacher1: 1,
                teacher2: 1,
                teacher3: 1,
                teacher4: 1,
                teacher5: 1,
                teacher6: 1,
              },
            },
          ])
          .toArray();

        resolve(timetables);
      } catch (error) {
        reject(error);
      }
    });
  },

  getAllTimetablesC5: () => {
    return new Promise(async (resolve, reject) => {
      try {
        let timetables = await db
          .get()
          .collection(collections.TIMETABLE_COLLECTION)
          .aggregate([
            {
              $match: { Class: "5" }
            },
            {
              $lookup: {
                from: collections.TEACHER_COLLECTION,
                localField: "teacher1",
                foreignField: "_id",
                as: "teacherInfo1",
              },
            },
            {
              $lookup: {
                from: collections.TEACHER_COLLECTION,
                localField: "teacher2",
                foreignField: "_id",
                as: "teacherInfo2",
              },
            },
            {
              $lookup: {
                from: collections.TEACHER_COLLECTION,
                localField: "teacher3",
                foreignField: "_id",
                as: "teacherInfo3",
              },
            },
            {
              $lookup: {
                from: collections.TEACHER_COLLECTION,
                localField: "teacher4",
                foreignField: "_id",
                as: "teacherInfo4",
              },
            },
            {
              $lookup: {
                from: collections.TEACHER_COLLECTION,
                localField: "teacher5",
                foreignField: "_id",
                as: "teacherInfo5",
              },
            },
            {
              $lookup: {
                from: collections.TEACHER_COLLECTION,
                localField: "teacher6",
                foreignField: "_id",
                as: "teacherInfo6",
              },
            },
            {
              $project: {
                _id: 1,
                sname: 1,
                scode: 1,
                day: 1,
                teacher1: 1,
                teacher2: 1,
                teacher3: 1,
                teacher4: 1,
                teacher5: 1,
                teacher6: 1,
              },
            },
          ])
          .toArray();

        resolve(timetables);
      } catch (error) {
        reject(error);
      }
    });
  },


  getAllTimetablesC6: () => {
    return new Promise(async (resolve, reject) => {
      try {
        let timetables = await db
          .get()
          .collection(collections.TIMETABLE_COLLECTION)
          .aggregate([
            {
              $match: { Class: "6" }
            },
            {
              $lookup: {
                from: collections.TEACHER_COLLECTION,
                localField: "teacher1",
                foreignField: "_id",
                as: "teacherInfo1",
              },
            },
            {
              $lookup: {
                from: collections.TEACHER_COLLECTION,
                localField: "teacher2",
                foreignField: "_id",
                as: "teacherInfo2",
              },
            },
            {
              $lookup: {
                from: collections.TEACHER_COLLECTION,
                localField: "teacher3",
                foreignField: "_id",
                as: "teacherInfo3",
              },
            },
            {
              $lookup: {
                from: collections.TEACHER_COLLECTION,
                localField: "teacher4",
                foreignField: "_id",
                as: "teacherInfo4",
              },
            },
            {
              $lookup: {
                from: collections.TEACHER_COLLECTION,
                localField: "teacher5",
                foreignField: "_id",
                as: "teacherInfo5",
              },
            },
            {
              $lookup: {
                from: collections.TEACHER_COLLECTION,
                localField: "teacher6",
                foreignField: "_id",
                as: "teacherInfo6",
              },
            },
            {
              $project: {
                _id: 1,
                sname: 1,
                scode: 1,
                day: 1,
                teacher1: 1,
                teacher2: 1,
                teacher3: 1,
                teacher4: 1,
                teacher5: 1,
                teacher6: 1,
              },
            },
          ])
          .toArray();

        resolve(timetables);
      } catch (error) {
        reject(error);
      }
    });
  },


  getAllTimetablesC7: () => {
    return new Promise(async (resolve, reject) => {
      try {
        let timetables = await db
          .get()
          .collection(collections.TIMETABLE_COLLECTION)
          .aggregate([
            {
              $match: { Class: "7" }
            },
            {
              $lookup: {
                from: collections.TEACHER_COLLECTION,
                localField: "teacher1",
                foreignField: "_id",
                as: "teacherInfo1",
              },
            },
            {
              $lookup: {
                from: collections.TEACHER_COLLECTION,
                localField: "teacher2",
                foreignField: "_id",
                as: "teacherInfo2",
              },
            },
            {
              $lookup: {
                from: collections.TEACHER_COLLECTION,
                localField: "teacher3",
                foreignField: "_id",
                as: "teacherInfo3",
              },
            },
            {
              $lookup: {
                from: collections.TEACHER_COLLECTION,
                localField: "teacher4",
                foreignField: "_id",
                as: "teacherInfo4",
              },
            },
            {
              $lookup: {
                from: collections.TEACHER_COLLECTION,
                localField: "teacher5",
                foreignField: "_id",
                as: "teacherInfo5",
              },
            },
            {
              $lookup: {
                from: collections.TEACHER_COLLECTION,
                localField: "teacher6",
                foreignField: "_id",
                as: "teacherInfo6",
              },
            },
            {
              $project: {
                _id: 1,
                sname: 1,
                scode: 1,
                day: 1,
                teacher1: 1,
                teacher2: 1,
                teacher3: 1,
                teacher4: 1,
                teacher5: 1,
                teacher6: 1,
              },
            },
          ])
          .toArray();

        resolve(timetables);
      } catch (error) {
        reject(error);
      }
    });
  },



  ///////ADD timetable/////////////////////                                         
  addTimetable: (timetable, callback) => {
    console.log(timetable); // Debugging

    db.get()
      .collection(collections.TIMETABLE_COLLECTION)
      .insertOne(timetable)
      .then((data) => {
        console.log("Timetable added:", data);
        callback(data.insertedId);
      })
      .catch((err) => console.error("Error inserting timetable:", err));
  },


  ///////ADD teacher/////////////////////                                         
  addnotification: (notification, callback) => {
    console.log(notification);

    // Convert userId to ObjectId if it's present

    if (notification.teacherId) {
      notification.teacherId = new objectId(notification.teacherId);
    }

    // Add createdAt field with the current timestamp
    notification.createdAt = new Date();

    db.get()
      .collection(collections.NOTIFICATIONS_COLLECTION)
      .insertOne(notification)
      .then((data) => {
        console.log(data);
        callback(data.ops[0]._id);
      })
      .catch((err) => {
        console.error("Error inserting notification:", err);
        callback(null);  // Handle error case by passing null
      });
  },



  ///////ADD students/////////////////////                                         
  addnotification2: (notification, callback) => {
    console.log(notification);

    // Convert userId to ObjectId if it's present
    if (notification.userId) {
      notification.userId = new objectId(notification.userId);
    }

    // Add createdAt field with the current timestamp
    notification.createdAt = new Date();

    db.get()
      .collection(collections.NOTIFICATIONS_STD_COLLECTION)
      .insertOne(notification)
      .then((data) => {
        console.log(data);
        callback(data.ops[0]._id);
      })
      .catch((err) => {
        console.error("Error inserting notification:", err);
        callback(null);  // Handle error case by passing null
      });
  },



  ///////GET ALL Notifications/////////////////////                                            
  getAllnotifications: () => {
    return new Promise(async (resolve, reject) => {
      try {
        let notifications = await db
          .get()
          .collection(collections.NOTIFICATIONS_COLLECTION)
          .aggregate([
            {
              $lookup: {
                from: collections.USERS_COLLECTION,
                localField: "userId",
                foreignField: "_id",
                as: "userDetails",
              },
            },
            {
              $lookup: {
                from: collections.TEACHER_COLLECTION,
                localField: "teacherId",
                foreignField: "_id",
                as: "teacherDetails",
              },
            },
            {
              $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true },
            },
            {
              $unwind: { path: "$teacherDetails", preserveNullAndEmptyArrays: true },
            },
            {
              $project: {
                _id: 1,
                message: 1,
                createdAt: 1,
                sender: 1, // Assuming there's a sender field
                userFname: { $ifNull: ["$userDetails.Fname", ""] },
                teacherFname: { $ifNull: ["$teacherDetails.Companyname", ""] },
              },
            },
          ])
          .toArray();

        resolve(notifications);
      } catch (err) {
        reject(err);
      }
    });
  },


  getAllnotifications2: () => {
    return new Promise(async (resolve, reject) => {
      try {
        let notifications = await db
          .get()
          .collection(collections.NOTIFICATIONS_STD_COLLECTION)
          .aggregate([
            {
              $lookup: {
                from: collections.USERS_COLLECTION,
                localField: "userId",
                foreignField: "_id",
                as: "userDetails",
              },
            },

            {
              $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true },
            },

            {
              $project: {
                _id: 1,
                message: 1,
                createdAt: 1,
                sender: 1, // Assuming there's a sender field
                userFname: { $ifNull: ["$userDetails.Fname", ""] },
              },
            },
          ])
          .toArray();

        resolve(notifications);
      } catch (err) {
        reject(err);
      }
    });
  },

  deletenotification: (notificationId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.NOTIFICATIONS_COLLECTION)
        .removeOne({
          _id: objectId(notificationId)
        })
        .then((response) => {
          console.log(response);
          resolve(response);
        });
    });
  },


  deletenotificationstd: (notificationId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.NOTIFICATIONS_STD_COLLECTION)
        .removeOne({
          _id: objectId(notificationId)
        })
        .then((response) => {
          console.log(response);
          resolve(response);
        });
    });
  },

  ///////GET ALL parent/////////////////////                                            
  getAllparents: () => {
    return new Promise(async (resolve, reject) => {
      let parents = await db
        .get()
        .collection(collections.PARENT_COLLECTION)
        .find()
        .toArray();
      resolve(parents);
    });
  },

  ///////ADD parent DETAILS/////////////////////                                            
  getparentDetails: (parentId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.PARENT_COLLECTION)
        .findOne({
          _id: objectId(parentId)
        })
        .then((response) => {
          resolve(response);
        });
    });
  },


  ///////ADD teacher/////////////////////                                         
  addteacher: (teacher, callback) => {
    console.log(teacher);
    teacher.Price = parseInt(teacher.Price);
    db.get()
      .collection(collections.TEACHER_COLLECTION)
      .insertOne(teacher)
      .then((data) => {
        console.log(data);
        callback(data.ops[0]._id);
      });
  },

  ///////GET ALL teacher/////////////////////                                            
  getAllteachers: () => {
    return new Promise(async (resolve, reject) => {
      let teachers = await db
        .get()
        .collection(collections.TEACHER_COLLECTION)
        .find()
        .toArray();
      resolve(teachers);
    });
  },

  ///////ADD teacher DETAILS/////////////////////                                            
  getteacherDetails: (teacherId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.TEACHER_COLLECTION)
        .findOne({
          _id: objectId(teacherId)
        })
        .then((response) => {
          resolve(response);
        });
    });
  },

  ///////DELETE teacher/////////////////////                                            
  deleteteacher: (teacherId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.TEACHER_COLLECTION)
        .removeOne({
          _id: objectId(teacherId)
        })
        .then((response) => {
          console.log(response);
          resolve(response);
        });
    });
  },

  ///////UPDATE teacher/////////////////////                                            
  updateteacher: (teacherId, teacherDetails) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.TEACHER_COLLECTION)
        .updateOne(
          {
            _id: objectId(teacherId)
          },
          {
            $set: {
              Name: teacherDetails.Name,
              Category: teacherDetails.Category,
              Price: teacherDetails.Price,
              Description: teacherDetails.Description,
            },
          }
        )
        .then((response) => {
          resolve();
        });
    });
  },


  ///////DELETE ALL teacher/////////////////////                                            
  deleteAllteachers: () => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.TEACHER_COLLECTION)
        .remove({})
        .then(() => {
          resolve();
        });
    });
  },


  addProduct: (product, callback) => {
    console.log(product);
    product.Price = parseInt(product.Price);
    db.get()
      .collection(collections.PRODUCTS_COLLECTION)
      .insertOne(product)
      .then((data) => {
        console.log(data);
        callback(data.ops[0]._id);
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

  doSignup: (adminData) => {
    return new Promise(async (resolve, reject) => {
      if (adminData.Code == "admin123") {
        adminData.Password = await bcrypt.hash(adminData.Password, 10);
        db.get()
          .collection(collections.ADMIN_COLLECTION)
          .insertOne(adminData)
          .then((data) => {
            resolve(data.ops[0]);
          });
      } else {
        resolve({ status: false });
      }
    });
  },

  doSignin: (adminData) => {
    return new Promise(async (resolve, reject) => {
      let response = {};
      let admin = await db
        .get()
        .collection(collections.ADMIN_COLLECTION)
        .findOne({ Email: adminData.Email });
      if (admin) {
        bcrypt.compare(adminData.Password, admin.Password).then((status) => {
          if (status) {
            console.log("Login Success");
            response.admin = admin;
            response.status = true;
            resolve(response);
          } else {
            console.log("Login Failed");
            resolve({ status: false });
          }
        });
      } else {
        console.log("Login Failed");
        resolve({ status: false });
      }
    });
  },

  getProductDetails: (productId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.PRODUCTS_COLLECTION)
        .findOne({ _id: objectId(productId) })
        .then((response) => {
          resolve(response);
        });
    });
  },

  deleteProduct: (productId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.PRODUCTS_COLLECTION)
        .removeOne({ _id: objectId(productId) })
        .then((response) => {
          console.log(response);
          resolve(response);
        });
    });
  },

  updateProduct: (productId, productDetails) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.PRODUCTS_COLLECTION)
        .updateOne(
          { _id: objectId(productId) },
          {
            $set: {
              Name: productDetails.Name,
              Category: productDetails.Category,
              Price: productDetails.Price,
              Description: productDetails.Description,
            },
          }
        )
        .then((response) => {
          resolve();
        });
    });
  },

  deleteAllProducts: () => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.PRODUCTS_COLLECTION)
        .remove({})
        .then(() => {
          resolve();
        });
    });
  },

  getAllUsers: () => {
    return new Promise(async (resolve, reject) => {
      try {
        const users = await db
          .get()
          .collection(collections.USERS_COLLECTION)
          .find()
          .sort({ createdAt: -1 })  // Sort by createdAt in descending order
          .toArray();

        resolve(users);
      } catch (err) {
        reject(err);  // Handle any error during fetching
      }
    });
  },


  removeUser: (userId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.USERS_COLLECTION)
        .removeOne({ _id: objectId(userId) })
        .then(() => {
          resolve();
        });
    });
  },

  blockUser: (userId) => {
    return new Promise((resolve, reject) => {
      try {
        // Convert the userId to ObjectId if it's not already
        const objectId = new ObjectId(userId);

        // Use updateOne to set isDisable to true
        db.get().collection(collections.USERS_COLLECTION).updateOne(
          { _id: objectId }, // Find user by ObjectId
          { $set: { isDisable: true } }, // Set the isDisable field to true
          (err, result) => {
            if (err) {
              reject(err); // Reject if there's an error
            } else {
              resolve(result); // Resolve if the update is successful
            }
          }
        );
      } catch (err) {
        reject(err); // Catch any error in case of an invalid ObjectId format
      }
    });
  },

  removeAllUsers: () => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.USERS_COLLECTION)
        .remove({})
        .then(() => {
          resolve();
        });
    });
  },

  getAllOrders: (fromDate, toDate) => {
    return new Promise(async (resolve, reject) => {
      try {
        let query = {};

        // If fromDate and toDate are provided, filter orders by the date range
        if (fromDate && toDate) {
          // Add one day to toDate and set it to midnight
          const adjustedToDate = new Date(toDate);
          adjustedToDate.setDate(adjustedToDate.getDate() + 1);

          query = {
            date: {
              $gte: new Date(fromDate), // Orders from the start date
              $lt: adjustedToDate       // Orders up to the end of the toDate
            }
          };
        }

        let orders = await db.get()
          .collection(collections.ORDER_COLLECTION)
          .find(query)
          .toArray();

        resolve(orders);
      } catch (error) {
        reject(error);
      }
    });
  },


  getOrdersByDateRange: (fromDate, toDate) => {
    return new Promise(async (resolve, reject) => {
      try {
        const orders = await db.get()
          .collection(collections.ORDER_COLLECTION)
          .find({
            createdAt: {
              $gte: new Date(fromDate), // Greater than or equal to the fromDate
              $lte: new Date(toDate)    // Less than or equal to the toDate
            }
          })
          .toArray();
        resolve(orders);
      } catch (error) {
        reject(error);
      }
    });
  },

  changeStatus: (status, orderId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.ORDER_COLLECTION)
        .updateOne(
          { _id: objectId(orderId) },
          {
            $set: {
              "orderObject.status": status,
            },
          }
        )
        .then(() => {
          resolve();
        });
    });
  },

  cancelOrder: (orderId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.ORDER_COLLECTION)
        .removeOne({ _id: objectId(orderId) })
        .then(() => {
          resolve();
        });
    });
  },

  cancelAllOrders: () => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.ORDER_COLLECTION)
        .remove({})
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


  /////////////////////////////////////////////////

  ///////GET ALL subject/////////////////////                                            
  getAllSubjects: () => {
    return new Promise(async (resolve, reject) => {
      try {
        let subjects = await db
          .get()
          .collection(collections.SUBJECT_COLLECTION)
          .aggregate([
            {
              $lookup: {
                from: collections.TEACHER_COLLECTION, // ✅ Correct teachers collection name
                localField: "teacher", // ✅ Field in SUBJECT_COLLECTION (Assuming teacher ID is stored here)
                foreignField: "_id", // ✅ Matching field in TEACHER_COLLECTION (ObjectId)
                as: "teacherInfo", // ✅ Output array field
              },
            },
            {
              $unwind: {
                path: "$teacherInfo",
                preserveNullAndEmptyArrays: true, // ✅ Keeps subjects without assigned teachers
              },
            },
            {
              $project: {
                _id: 1, // ✅ Keep subject ID
                sname: 1, // ✅ Keep subject name
                scode: 1, // ✅ Add any other subject details
                teacher: "$teacherInfo.Companyname", // ✅ Replace teacher ID with name
              },
            },
          ])
          .toArray();
        resolve(subjects);
      } catch (error) {
        reject(error);
      }
    });
  },

  ///////ADD subject/////////////////////                                         
  addSubject: (subject, callback) => {
    console.log(subject);

    // Convert teacher ID to ObjectId
    if (subject.teacher) {
      subject.teacher = new ObjectId(subject.teacher);
    }

    db.get()
      .collection(collections.SUBJECT_COLLECTION)
      .insertOne(subject)
      .then((data) => {
        console.log("Subject added:", data);

        const subjectId = data.insertedId; // ✅ Get the inserted subject ID

        // ✅ Update the teacher document with the latest subject (replace previous one)
        if (subject.teacher) {
          db.get()
            .collection(collections.TEACHER_COLLECTION)
            .updateOne(
              { _id: subject.teacher }, // ✅ Find teacher by ID
              { $set: { subject: subjectId } } // ✅ Replace the `subject` field
            )
            .then(() => {
              console.log(`Subject ID ${subjectId} set for Teacher ID ${subject.teacher}`);
            })
            .catch((err) => console.error("Error updating teacher:", err));
        }

        callback(subjectId);
      })
      .catch((err) => console.error("Error inserting subject:", err));
  },

  ///////All Attendance/////////////////////                                         
  getFilteredAttendance: (filters) => {
    return new Promise(async (resolve, reject) => {
      try {
        let matchQuery = {};

        // Filter by date range
        if (filters.fromDate && filters.toDate) {
          matchQuery.selectedDate = {
            $gte: filters.fromDate,
            $lte: filters.toDate
          };
        } else if (filters.fromDate) {
          matchQuery.selectedDate = { $gte: filters.fromDate };
        } else if (filters.toDate) {
          matchQuery.selectedDate = { $lte: filters.toDate };
        }

        // Filter by period, class, subject
        if (filters.period) matchQuery.period = filters.period;
        if (filters.class) matchQuery.Class = filters.class;
        if (filters.subject) matchQuery.subject = filters.subject;

        // Lookup teacher, subject, present & absent students
        let attendance = await db.get()
          .collection(collections.ATTENDANCE_COLLECTION)
          .aggregate([
            { $match: matchQuery },

            { // Lookup for teacher details
              $lookup: {
                from: collections.TEACHER_COLLECTION,
                localField: "teacherId",
                foreignField: "_id",
                as: "teacherDetails",
              }
            },
            { $unwind: { path: "$teacherDetails", preserveNullAndEmptyArrays: true } },

            { // Lookup for subject details
              $lookup: {
                from: collections.SUBJECT_COLLECTION,
                localField: "subjectId",
                foreignField: "_id",
                as: "subjectDetails",
              }
            },
            { $unwind: { path: "$subjectDetails", preserveNullAndEmptyArrays: true } },

            { // Lookup for present students
              $lookup: {
                from: collections.USERS_COLLECTION,
                localField: "present",
                foreignField: "_id",
                as: "presentUserDetails",
              }
            },

            { // Lookup for absent students
              $lookup: {
                from: collections.USERS_COLLECTION,
                localField: "absent",
                foreignField: "_id",
                as: "absentUserDetails",
              }
            },

            { // Project required fields
              $project: {
                date: 1,
                subject: 1,
                Class: 1,
                period: 1,
                teacherName: { $ifNull: ["$teacherDetails.Companyname", ""] },
                subjectName: { $ifNull: ["$subjectDetails.sname", ""] },
                present: {
                  $ifNull: [
                    {
                      $map: {
                        input: "$presentUserDetails",
                        as: "user",
                        in: "$$user.Fname",
                      },
                    },
                    [],
                  ],
                },
                absent: {
                  $ifNull: [
                    {
                      $map: {
                        input: "$absentUserDetails",
                        as: "user",
                        in: "$$user.Fname",
                      },
                    },
                    [],
                  ],
                },
              }
            }
          ])
          .toArray();

        // Apply filter for present/absent students
        if (filters.filter === "present") {
          attendance = attendance.filter(item => item.present.length > 0);
        } else if (filters.filter === "absent") {
          attendance = attendance.filter(item => item.absent.length > 0);
        }

        resolve(attendance);
      } catch (err) {
        console.error("Error fetching filtered attendance:", err);
        reject(err);
      }
    });
  },


  addanouncement: (anouncement, callback) => {
    console.log(anouncement);
    anouncement.createdAt = new Date();

    db.get()
      .collection(collections.ANOUNCEMENTS_COLLECTION)
      .insertOne(anouncement)
      .then((data) => {
        console.log(data);
        callback(data.ops[0]._id);
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


  deleteanouncement: (anouncementId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.ANOUNCEMENTS_COLLECTION)
        .removeOne({
          _id: objectId(anouncementId)
        })
        .then((response) => {
          console.log(response);
          resolve(response);
        });
    });
  },




  ///////GET ALL exam/////////////////////                                            
  getAllexams: () => {
    return new Promise(async (resolve, reject) => {
      let exams = await db
        .get()
        .collection(collections.EXAM_COLLECTION)
        .find()
        .toArray();
      resolve(exams);
    });
  },

};


