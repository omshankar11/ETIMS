import { useEffect, useState, useCallback } from "react";
import API from "../services/api";
import { generateInvoicePDF } from "../utils/pdfGenerator";

const Invoices = () => {
    const [invoices, setInvoices] = useState([]);
    const [businesses, setBusinesses] = useState([]);
    const [showForm, setShowForm] = useState(false);

    // Invoice Form State
    const [businessId, setBusinessId] = useState("");
    const [items, setItems] = useState([{ productName: "", quantity: 1, unitPrice: 0, taxRate: 16 }]);

    const fetchInvoices = useCallback(async () => {
        try {
            const { data } = await API.get("/invoices");
            setInvoices(data);
        } catch (error) {
            console.error(error);
        }
    }, []);

    const fetchBusinesses = useCallback(async () => {
        try {
            const { data } = await API.get("/business");
            setBusinesses(data);
            if (data.length > 0) setBusinessId(data[0]._id);
        } catch (error) {
            console.error(error);
        }
    }, []);

    useEffect(() => {
        fetchInvoices();
        fetchBusinesses();
    }, [fetchInvoices, fetchBusinesses]);

    const handleItemChange = (index, e) => {
        const newItems = [...items];
        newItems[index][e.target.name] = e.target.value;
        setItems(newItems);
    };

    const addItem = () => {
        setItems([...items, { productName: "", quantity: 1, unitPrice: 0, taxRate: 16 }]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post("/invoices", {
                businessId,
                items,
                status: "Submitted" // Auto-submit for mock API
            });
            setShowForm(false);
            setItems([{ productName: "", quantity: 1, unitPrice: 0, taxRate: 16 }]);
            fetchInvoices();
        } catch (error) {
            alert(error.response?.data?.message || "Error creating invoice");
        }
    };

    const handleDownload = (invoice) => {
        generateInvoicePDF(invoice);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Invoices</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    {showForm ? "Cancel" : "Create New Invoice"}
                </button>
            </div>

            {showForm && (
                <div className="bg-white p-6 rounded shadow mb-6">
                    <h2 className="text-xl font-bold mb-4">Create Tax Invoice</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block font-bold mb-2">Select Business</label>
                            <select value={businessId} onChange={(e) => setBusinessId(e.target.value)} className="border p-2 rounded w-full">
                                {businesses.map(b => (
                                    <option key={b._id} value={b._id}>{b.businessName}</option>
                                ))}
                            </select>
                        </div>

                        <h3 className="font-bold mb-2">Items</h3>
                        {items.map((item, index) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2 p-2 border rounded bg-gray-50">
                                <input type="text" name="productName" placeholder="Product Name" value={item.productName} onChange={(e) => handleItemChange(index, e)} className="border p-2 rounded" required />
                                <input type="number" name="quantity" placeholder="Qty" value={item.quantity} onChange={(e) => handleItemChange(index, e)} className="border p-2 rounded" min="1" required />
                                <input type="number" name="unitPrice" placeholder="Price" value={item.unitPrice} onChange={(e) => handleItemChange(index, e)} className="border p-2 rounded" min="0" required />
                                <input type="number" name="taxRate" placeholder="Tax %" value={item.taxRate} onChange={(e) => handleItemChange(index, e)} className="border p-2 rounded" readOnly />
                            </div>
                        ))}
                        <button type="button" onClick={addItem} className="text-blue-600 text-sm mb-4">+ Add Item</button>

                        <button type="submit" className="block w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Submit & Send to ETIMS</button>
                    </form>
                </div>
            )}

            <div className="bg-white rounded shadow overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr>
                            <th className="p-4 border-b">Invoice #</th>
                            <th className="p-4 border-b">Business</th>
                            <th className="p-4 border-b">Date</th>
                            <th className="p-4 border-b">Total</th>
                            <th className="p-4 border-b">Tax</th>
                            <th className="p-4 border-b">Status</th>
                            <th className="p-4 border-b">ETIMS</th>
                            <th className="p-4 border-b">Download</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices.map((inv) => (
                            <tr key={inv._id} className="hover:bg-gray-50">
                                <td className="p-4 border-b text-sm font-mono">{inv.invoiceNumber}</td>
                                <td className="p-4 border-b">{inv.businessId?.businessName}</td>
                                <td className="p-4 border-b text-sm text-gray-600">
                                    {new Date(inv.createdAt).toLocaleDateString()}
                                </td>
                                <td className="p-4 border-b font-medium">${inv.totalAmount.toFixed(2)}</td>
                                <td className="p-4 border-b text-gray-500">${inv.taxAmount.toFixed(2)}</td>
                                <td className="p-4 border-b">
                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${inv.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                        inv.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {inv.status}
                                    </span>
                                </td>
                                <td className="p-4 border-b text-xs text-gray-500 max-w-xs truncate">
                                    {inv.etimsResponse?.message}
                                </td>
                                <td className="p-4 border-b">
                                    <button
                                        onClick={() => handleDownload(inv)}
                                        className="bg-gray-800 text-white px-3 py-1 rounded text-sm hover:bg-gray-900 flex items-center gap-2"
                                    >
                                        <span>Download</span>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Invoices;
