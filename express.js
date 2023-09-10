const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const db = require("./config/database");
const apiError = require("./utils/ErroreApi");
const router = require("./api/user");
const AuthRouter = require("./api/auth");
const IraqDegreeCollegeRouter = require("./api/IraqCollegeDegrees");
const KurdistanDegreeCollegeRouter = require("./api/KurdistanCollegeDgrees");
const TypeCollegeRouter = require("./api/TypeCollege");
const multer = require("multer");
const excelToJson = require("convert-excel-to-json");
dotenv.config({ path: "config.env" });
//express app
db(); 
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname,'uploads')))
if (process.env.NODE_ENV == "development") {
  console.log("it is development");
  app.use(morgan("dev"));
}
// servers(app)
app.use("/api/v2/user", router);
app.use("/api/v2/auth", AuthRouter);
app.use("/api/v2/iraqdegreecollege", IraqDegreeCollegeRouter);
app.use("/api/v2/kurdistandegreecollege", KurdistanDegreeCollegeRouter);
app.use("/api/v2/typecollege", TypeCollegeRouter);

app.all("*", (res, req, next) => {
  next(new apiError(`this url is ${res.originalUrl}`, 400));
});

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log("App good");
});
//routs
process.on("unhandledRejection", (err) => {
  console.error(`Unhandled rejection:${err}`);
  server.close(() => {
    process.exit(1);
  });
});