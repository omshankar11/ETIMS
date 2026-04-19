const Business = require("../models/Business");

// @desc    Register a new business
// @route   POST /api/business
// @access  Private (Business Owner)
const registerBusiness = async (req, res) => {
    const { businessName, TIN, address, contact } = req.body;

    if (!businessName || !TIN || !address || !contact) {
        return res.status(400).json({ message: "Please add all fields" });
    }

    // Check if business exists
    const businessExists = await Business.findOne({ TIN });

    if (businessExists) {
        return res.status(400).json({ message: "Business with this TIN already exists" });
    }

    const business = await Business.create({
        userId: req.user.id,
        businessName,
        TIN,
        address,
        contact,
    });

    res.status(201).json(business);
};

// @desc    Get user's businesses
// @route   GET /api/business
// @access  Private
const getBusinesses = async (req, res) => {
    const businesses = await Business.find({ userId: req.user.id });
    res.status(200).json(businesses);
};

// @desc    Update business
// @route   PUT /api/business/:id
// @access  Private
const updateBusiness = async (req, res) => {
    const business = await Business.findById(req.params.id);

    if (!business) {
        return res.status(404).json({ message: "Business not found" });
    }

    // Check user
    if (business.userId.toString() !== req.user.id) {
        return res.status(401).json({ message: "User not authorized" });
    }

    const updatedBusiness = await Business.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );

    res.status(200).json(updatedBusiness);
};

// @desc    Delete business
// @route   DELETE /api/business/:id
// @access  Private
const deleteBusiness = async (req, res) => {
    const business = await Business.findById(req.params.id);

    if (!business) {
        return res.status(404).json({ message: "Business not found" });
    }

    // Check user
    if (business.userId.toString() !== req.user.id) {
        return res.status(401).json({ message: "User not authorized" });
    }

    await business.remove();

    res.status(200).json({ id: req.params.id });
};

module.exports = {
    registerBusiness,
    getBusinesses,
    updateBusiness,
    deleteBusiness,
};
