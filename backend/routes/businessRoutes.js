const express = require("express");
const router = express.Router();
const {
    registerBusiness,
    getBusinesses,
    updateBusiness,
    deleteBusiness,
} = require("../controllers/businessController");
const { protect } = require("../middleware/authMiddleware");

router.route("/")
    .post(protect, registerBusiness)
    .get(protect, getBusinesses);

router.route("/:id")
    .put(protect, updateBusiness)
    .delete(protect, deleteBusiness);

module.exports = router;
