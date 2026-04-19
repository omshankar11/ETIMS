const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    unitPrice: {
        type: Number,
        required: true,
        min: 0,
    },
    taxRate: {
        type: Number,
        required: true,
        default: 16, // Default VAT 16%
    },
    total: { // Line total including tax? Or excluding? Usually quantity * unitPrice. Tax is calculated separately or per line.
        // Let's store line total excluding tax and maybe separate tax amount per line if needed.
        // Spec says: Auto-calculate Subtotal, Tax Amount, Total Amount.
        // Usually line total = quantity * unitPrice.
        type: Number,
    }
});

const InvoiceSchema = new mongoose.Schema(
    {
        businessId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Business",
            required: true,
        },
        // Adding userId to track WHO created it if multiple users manage one business (future proof)
        // For now, assuming businessId is enough link.
        invoiceNumber: {
            type: String,
            required: true,
            unique: true,
        },
        items: [itemSchema],
        subtotal: {
            type: Number,
            required: true,
        },
        taxAmount: {
            type: Number,
            required: true,
        },
        totalAmount: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["Draft", "Submitted", "Approved", "Rejected"],
            default: "Draft",
        },
        etimsResponse: { // To store mock API response
            type: Object
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Invoice", InvoiceSchema);
