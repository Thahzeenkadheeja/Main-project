var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var hbs = require("express-handlebars");
var usersRouter = require("./routes/users");
var adminRouter = require("./routes/admin");
var teacherRouter = require("./routes/teacher");
var parentRouter = require("./routes/parent");

var fileUpload = require("express-fileupload");
var db = require("./config/connection");
var session = require("express-session");
var app = express();
const Handlebars = require('handlebars');


// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

Handlebars.registerHelper('eq', function (a, b) {
  return a === b;
});

// Set up Handlebars engine with helpers
app.engine(
  "hbs",
  hbs({
    extname: "hbs",
    defaultLayout: "layout",
    layoutsDir: __dirname + "/views/layout/",
    partialsDir: __dirname + "/views/header-partials/",
    helpers: {
      incremented: function (index) {
        index++;
        return index;
      },
      eq: function (a, b) {
        return a === b;
      },
      formatDate: function (dateString) {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const year = date.getFullYear();
        return `${day}-${month}-${year}`; // Return the formatted date
      },
      ifCond: function (v1, v2, options) {
        return v1 === v2 ? options.fn(this) : options.inverse(this);
      }
    },
  })
);



app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(fileUpload());
app.use(
  session({
    secret: "Key",
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 1 day in milliseconds
  })
);
db.connect((err) => {
  if (err) console.log("Error" + err);
  else console.log("\x1b[38;2;144;238;144mDatabase Connected Successfully ✅ \x1b[0m");
  console.log("\x1b[38;2;144;238;144mYour Link : http://localhost:4006/ ✅ \x1b[0m");
});
app.use("/", usersRouter);
app.use("/admin", adminRouter);
app.use("/parents", parentRouter);

app.use("/teacher", teacherRouter);

app.use("/teacher/classes", teacherRouter);

app.use("/admin/users", adminRouter);
app.use("/admin/teacher", adminRouter);
app.use("/admin/parents", adminRouter);
app.use("/admin/subjects", adminRouter);
app.use("/admin/attendance", adminRouter);
app.use("/admin/timetable", adminRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
