const Invoice = require("../models/Invoice");
const Business = require("../models/Business");

// @desc    Get dashboard stats
// @route   GET /api/dashboard
// @access  Private
const getDashboardStats = async (req, res) => {
    const businesses = await Business.find({ userId: req.user.id });
    const businessIds = businesses.map(b => b._id);

    // Total Invoices
    const totalInvoices = await Invoice.countDocuments({ businessId: { $in: businessIds } });

    // Total Tax Collected & Revenue
    const aggregation = await Invoice.aggregate([
        { $match: { businessId: { $in: businessIds } } },
        {
            $group: {
                _id: null,
                totalTax: { $sum: "$taxAmount" },
                totalRevenue: { $sum: "$totalAmount" },
            },
        },
    ]);

    const totalTax = aggregation.length > 0 ? aggregation[0].totalTax : 0;
    const totalRevenue = aggregation.length > 0 ? aggregation[0].totalRevenue : 0;

    // Monthly Revenue Chart (Last 6 months)
    const monthlyRevenue = await Invoice.aggregate([
        { $match: { businessId: { $in: businessIds } } },
        {
            $group: {
                _id: { $month: "$createdAt" },
                revenue: { $sum: "$totalAmount" },
            },
        },
        { $sort: { _id: 1 } }
    ]);

    // Recent Transactions
    const recentTransactions = await Invoice.find({ businessId: { $in: businessIds } })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("businessId", "businessName");

    res.status(200).json({
        totalInvoices,
        totalTax,
        totalRevenue,
        monthlyRevenue,
        recentTransactions,
    });
};

module.exports = {
    getDashboardStats,
};
