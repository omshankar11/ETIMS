const axios = require("axios");

const API_URL = "http://localhost:5000/api";

const testBackend = async () => {
    try {
        console.log("Starting Backend Verification...");

        // 1. Register User
        const email = `test${Date.now()}@example.com`;
        console.log(`\n1. Registering user: ${email}...`);
        let res = await axios.post(`${API_URL}/auth/register`, {
            name: "Test User",
            email,
            password: "password123",
            role: "business_owner",
        });
        console.log("   User registered. Token received.");
        const token = res.data.token;
        const config = { headers: { Authorization: `Bearer ${token}` } };

        // 2. Login User
        console.log("\n2. Logging in user...");
        res = await axios.post(`${API_URL}/auth/login`, {
            email,
            password: "password123",
        });
        console.log("   Login successful.");

        // 3. Create Business
        console.log("\n3. Creating Business...");
        const tin = `TIN-${Date.now()}`;
        res = await axios.post(
            `${API_URL}/business`,
            {
                businessName: "Test Corp",
                TIN: tin,
                address: "123 Tech St",
                contact: "123-456-7890",
            },
            config
        );
        console.log("   Business created:", res.data.businessName);
        const businessId = res.data._id;

        // 4. Create Invoice
        console.log("\n4. Creating Invoice...");
        res = await axios.post(
            `${API_URL}/invoices`,
            {
                businessId,
                items: [
                    { productName: "Laptop", quantity: 2, unitPrice: 1000, taxRate: 16 },
                ],
                status: "Draft",
            },
            config
        );
        console.log("   Invoice created:", res.data.invoiceNumber);
        console.log("   Total Amount:", res.data.totalAmount);

        // 5. Submit Invoice (Mock API)
        console.log("\n5. Submitting Invoice (Mock ETIMS)...");
        res = await axios.post(
            `${API_URL}/invoices`,
            {
                businessId,
                items: [
                    { productName: "Phone", quantity: 5, unitPrice: 500, taxRate: 16 },
                ],
                status: "Submitted",
            },
            config
        );
        console.log("   Invoice submitted. Status:", res.data.status);
        console.log("   ETIMS Response:", res.data.etimsResponse?.message);

        // 6. Get Dashboard Stats
        console.log("\n6. Fetching Dashboard Stats...");
        res = await axios.get(`${API_URL}/dashboard`, config);
        console.log("   Total Invoices:", res.data.totalInvoices);
        console.log("   Total Revenue:", res.data.totalRevenue);

        console.log("\n✅ verification PASSED!");
    } catch (error) {
        console.error(
            "\n❌ Verification FAILED:",
            error.response?.data?.message || error.message
        );
        process.exit(1);
    }
};

testBackend();
