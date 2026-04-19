import { useState } from "react";

const Reports = () => {
    // Dummy Data
    const summaryData = {
        totalTaxableAmount: 1250000,
        totalVat: 200000,
        monthlyCollections: 45000
    };

    const chartData = [
        { month: "Jan", amount: 15000 },
        { month: "Feb", amount: 22000 },
        { month: "Mar", amount: 18000 },
        { month: "Apr", amount: 25000 },
        { month: "May", amount: 30000 },
        { month: "Jun", amount: 28000 },
    ];

    const maxAmount = Math.max(...chartData.map(d => d.amount));

    const recentReturns = [
        { id: "RET-001", period: "Jan 2026", dateFiled: "2026-02-10", amount: 15000, status: "Submitted" },
        { id: "RET-002", period: "Feb 2026", dateFiled: "2026-03-12", amount: 22000, status: "Submitted" },
        { id: "RET-003", period: "Mar 2026", dateFiled: "2026-04-15", amount: 18000, status: "Pending" },
        { id: "RET-004", period: "Apr 2026", dateFiled: "2026-05-18", amount: 25000, status: "Late" },
    ];

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Tax Reports</h1>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded shadow border-l-4 border-blue-500">
                    <h3 className="text-gray-500 text-sm font-bold uppercase">Total Taxable Amount</h3>
                    <p className="text-2xl font-bold mt-2">${summaryData.totalTaxableAmount.toLocaleString()}</p>
                </div>
                <div className="bg-white p-6 rounded shadow border-l-4 border-green-500">
                    <h3 className="text-gray-500 text-sm font-bold uppercase">Total VAT Collected</h3>
                    <p className="text-2xl font-bold mt-2">${summaryData.totalVat.toLocaleString()}</p>
                </div>
                <div className="bg-white p-6 rounded shadow border-l-4 border-purple-500">
                    <h3 className="text-gray-500 text-sm font-bold uppercase">Avg. Monthly Collection</h3>
                    <p className="text-2xl font-bold mt-2">${summaryData.monthlyCollections.toLocaleString()}</p>
                </div>
            </div>

            {/* Charts Section */}
            <div className="bg-white p-6 rounded shadow mb-8">
                <h2 className="text-xl font-bold mb-6">Monthly Tax Trends (Jan - Jun)</h2>
                <div className="flex items-end space-x-4 h-64 border-b border-l border-gray-300 p-4">
                    {chartData.map((data, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center group">
                            <div
                                className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-all relative"
                                style={{ height: `${(data.amount / maxAmount) * 100}%` }}
                            >
                                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                    ${data.amount.toLocaleString()}
                                </span>
                            </div>
                            <span className="text-xs text-gray-500 mt-2">{data.month}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Returns Table */}
            <div className="bg-white rounded shadow overflow-hidden">
                <div className="p-4 border-b">
                    <h2 className="text-xl font-bold">Recent Tax Returns</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-4 border-b font-semibold text-gray-600">Return ID</th>
                                <th className="p-4 border-b font-semibold text-gray-600">Period</th>
                                <th className="p-4 border-b font-semibold text-gray-600">Date Filed</th>
                                <th className="p-4 border-b font-semibold text-gray-600">Amount</th>
                                <th className="p-4 border-b font-semibold text-gray-600">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentReturns.map((ret, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="p-4 border-b font-mono text-sm text-blue-600">{ret.id}</td>
                                    <td className="p-4 border-b">{ret.period}</td>
                                    <td className="p-4 border-b">{ret.dateFiled}</td>
                                    <td className="p-4 border-b font-medium">${ret.amount.toLocaleString()}</td>
                                    <td className="p-4 border-b">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${ret.status === 'Submitted' ? 'bg-green-100 text-green-800' :
                                                ret.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                            }`}>
                                            {ret.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Reports;
