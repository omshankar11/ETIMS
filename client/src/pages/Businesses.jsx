import { useEffect, useState } from "react";
import API from "../services/api";

const Businesses = () => {
    const [businesses, setBusinesses] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        businessName: "",
        TIN: "",
        address: "",
        contact: ""
    });

    useEffect(() => {
        fetchBusinesses();
    }, []);

    const fetchBusinesses = async () => {
        try {
            const { data } = await API.get("/business");
            setBusinesses(data);
        } catch (error) {
            console.error("Error fetching businesses", error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post("/business", formData);
            setShowForm(false);
            setFormData({ businessName: "", TIN: "", address: "", contact: "" });
            fetchBusinesses();
        } catch (error) {
            alert(error.response?.data?.message || "Error creating business");
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">My Businesses</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    {showForm ? "Cancel" : "Register New Business"}
                </button>
            </div>

            {showForm && (
                <div className="bg-white p-6 rounded shadow mb-6">
                    <h2 className="text-xl font-bold mb-4">Register Business</h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" name="businessName" placeholder="Business Name" value={formData.businessName} onChange={handleChange} className="border p-2 rounded" required />
                        <input type="text" name="TIN" placeholder="Tax Identification Number" value={formData.TIN} onChange={handleChange} className="border p-2 rounded" required />
                        <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} className="border p-2 rounded" required />
                        <input type="text" name="contact" placeholder="Contact Info" value={formData.contact} onChange={handleChange} className="border p-2 rounded" required />
                        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 md:col-span-2">Register</button>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {businesses.map((business) => (
                    <div key={business._id} className="bg-white p-4 rounded shadow">
                        <h3 className="font-bold text-lg">{business.businessName}</h3>
                        <p className="text-gray-600">TIN: {business.TIN}</p>
                        <p className="text-gray-600">{business.address}</p>
                        <p className="text-gray-600">{business.contact}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Businesses;
