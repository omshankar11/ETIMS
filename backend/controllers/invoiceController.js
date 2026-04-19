const Invoice = require("../models/Invoice");
const Business = require("../models/Business");

// Mock ETIMS API call
const submitToEtims = async (invoiceData) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Simulate 90% success rate
            const isSuccess = Math.random() < 0.9;
            resolve({
                success: isSuccess,
                message: isSuccess ? "Invoice approved by ETIMS" : "Invoice rejected by ETIMS",
                etimsId: isSuccess ? `ETIMS-${Date.now()}` : null,
            });
        }, 1000);
    });
};

// @desc    Create new invoice
// @route   POST /api/invoices
// @access  Private
const createInvoice = async (req, res) => {
    const { businessId, items, status } = req.body;

    if (!businessId || !items || items.length === 0) {
        return res.status(400).json({ message: "Please add businessId and items" });
    }

    // Verify business ownership
    const business = await Business.findById(businessId);
    if (!business) {
        return res.status(404).json({ message: "Business not found" });
    }
    if (business.userId.toString() !== req.user.id) {
        return res.status(401).json({ message: "User not authorized" });
    }

    // Calculate totals
    let subtotal = 0;
    let taxAmount = 0;

    const calculatedItems = items.map((item) => {
        const itemTotal = item.quantity * item.unitPrice;
        const itemTax = (itemTotal * item.taxRate) / 100;
        subtotal += itemTotal;
        taxAmount += itemTax;
        return {
            ...item,
        };
    });

    const totalAmount = subtotal + taxAmount;

    // Generate Invoice Number (Simple Ref)
    const count = await Invoice.countDocuments();
    const invoiceNumber = `INV-${Date.now()}-${count + 1}`;

    let invoice = await Invoice.create({
        businessId,
        invoiceNumber,
        items: calculatedItems,
        subtotal,
        taxAmount,
        totalAmount,
        status: status || "Draft",
    });

    // If status is Submitted, call Mock API
    if (invoice.status === "Submitted") {
        const etimsResponse = await submitToEtims(invoice);
        invoice.etimsResponse = etimsResponse;
        invoice.status = etimsResponse.success ? "Approved" : "Rejected";
        await invoice.save();
    }

    res.status(201).json(invoice);
};

// @desc    Get user invoices (filter by business optional)
// @route   GET /api/invoices
// @access  Private
const getInvoices = async (req, res) => {
    // Find all businesses of the user
    const businesses = await Business.find({ userId: req.user.id });
    const businessIds = businesses.map(b => b._id);

    let query = { businessId: { $in: businessIds } };

    // Optional: Filter by specific business if provided in query
    if (req.query.businessId) {
        if (businessIds.some(id => id.toString() === req.query.businessId)) {
            query.businessId = req.query.businessId;
        } else {
            return res.status(401).json({ message: "Not authorized for this business" });
        }
    }

    const invoices = await Invoice.find(query).populate("businessId", "businessName TIN").sort({ createdAt: -1 });
    res.status(200).json(invoices);
};

// @desc    Get single invoice
// @route   GET /api/invoices/:id
// @access  Private
const getInvoiceById = async (req, res) => {
    const invoice = await Invoice.findById(req.params.id).populate("businessId");

    if (!invoice) {
        return res.status(404).json({ message: "Invoice not found" });
    }

    // Check ownership via business
    const business = await Business.findById(invoice.businessId._id);
    if (business.userId.toString() !== req.user.id) {
        return res.status(401).json({ message: "User not authorized" });
    }

    res.status(200).json(invoice);
};

module.exports = {
    createInvoice,
    getInvoices,
    getInvoiceById,
};
