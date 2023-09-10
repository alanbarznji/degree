const { c_Type, g_Type, u_Type, d_Type, gs_Type } = require("../service/TypeCollege");
const express = require("express");

const router = express.Router();
const Validation = require("../validation/validation");
const { protect, toAllow } = require("../service/auth");
// const { cr_IraqCollegeDegree } = require("../utils/Error/IraqType");
router
  .route("/")
  .post(protect, toAllow("admin", "user"),c_Type)
  .get(protect, toAllow("admin", "user"), g_Type);
router
  .route("/:id")
  .put(protect,toAllow("admin"),u_Type)
  .delete(protect,toAllow("admin"),d_Type)
  .get(protect,toAllow("admin"), gs_Type);

module.exports = router;
