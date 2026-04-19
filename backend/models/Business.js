const mongoose = require("mongoose");

const BusinessSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        businessName: {
            type: String,
            required: [true, "Please add a business name"],
        },
        TIN: {
            type: String,
            required: [true, "Please add a Tax Identification Number"],
            unique: true,
        },
        address: {
            type: String,
            required: [true, "Please add an address"],
        },
        contact: {
            type: String,
            required: [true, "Please add contact information"],
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Business", BusinessSchema);
