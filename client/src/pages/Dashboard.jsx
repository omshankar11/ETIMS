import { useEffect, useState, useContext } from "react";
import API from "../services/api";
import AuthContext from "../context/AuthContext";

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState({
        totalInvoices: 0,
        totalTax: 0,
        totalRevenue: 0,
        recentTransactions: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await API.get("/dashboard");
                setStats(data);
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded shadow">
                    <h3 className="text-gray-500 text-sm uppercase">Total Invoices</h3>
                    <p className="text-3xl font-bold">{stats.totalInvoices}</p>
                </div>
                <div className="bg-white p-6 rounded shadow">
                    <h3 className="text-gray-500 text-sm uppercase">Total Tax Collected</h3>
                    <p className="text-3xl font-bold text-red-600">${stats.totalTax.toFixed(2)}</p>
                </div>
                <div className="bg-white p-6 rounded shadow">
                    <h3 className="text-gray-500 text-sm uppercase">Total Revenue</h3>
                    <p className="text-3xl font-bold text-green-600">${stats.totalRevenue.toFixed(2)}</p>
                </div>
            </div>

            <h2 className="text-2xl font-bold mb-4">Recent Transactions</h2>
            <div className="bg-white rounded shadow overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr>
                            <th className="p-4 border-b">Invoice #</th>
                            <th className="p-4 border-b">Business</th>
                            <th className="p-4 border-b">Date</th>
                            <th className="p-4 border-b">Amount</th>
                            <th className="p-4 border-b">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stats.recentTransactions.length > 0 ? (
                            stats.recentTransactions.map((tx) => (
                                <tr key={tx._id} className="hover:bg-gray-50">
                                    <td className="p-4 border-b">{tx.invoiceNumber}</td>
                                    <td className="p-4 border-b">{tx.businessId?.businessName || 'N/A'}</td>
                                    <td className="p-4 border-b">{new Date(tx.createdAt).toLocaleDateString()}</td>
                                    <td className="p-4 border-b">${tx.totalAmount.toFixed(2)}</td>
                                    <td className="p-4 border-b">
                                        <span className={`px-2 py-1 rounded text-xs ${tx.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                                tx.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {tx.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="p-4 text-center text-gray-500">No recent transactions</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Dashboard;
