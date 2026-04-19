import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * Generates and downloads a PDF invoice.
 * @param {Object} invoice - The invoice object containing all details.
 */
export const generateInvoicePDF = (invoice) => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(18);
    doc.text("Tax Invoice", 14, 22);

    doc.setFontSize(11);
    doc.setTextColor(100);

    // Business Info
    const businessName = invoice.businessId?.businessName || "Unknown Business";
    doc.text(`Business: ${businessName}`, 14, 32);

    // Invoice Details
    doc.text(`Invoice #: ${invoice.invoiceNumber}`, 14, 40);
    doc.text(`Date: ${new Date(invoice.createdAt).toLocaleDateString()}`, 14, 46);
    doc.text(`Status: ${invoice.status}`, 14, 52);

    // Items Table
    const tableColumn = ["Product", "Quantity", "Unit Price", "Tax Rate", "Total"];
    const tableRows = [];

    invoice.items.forEach(item => {
        const itemTotal = item.quantity * item.unitPrice;
        const itemData = [
            item.productName,
            item.quantity,
            `$${item.unitPrice.toFixed(2)}`,
            `${item.taxRate}%`,
            `$${itemTotal.toFixed(2)}`
        ];
        tableRows.push(itemData);
    });

    autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 60,
    });

    // Totals
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.text(`Subtotal: $${invoice.subtotal.toFixed(2)}`, 14, finalY);
    doc.text(`Tax Amount: $${invoice.taxAmount.toFixed(2)}`, 14, finalY + 6);
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`Total Amount: $${invoice.totalAmount.toFixed(2)}`, 14, finalY + 14);

    doc.save(`Invoice_${invoice.invoiceNumber}.pdf`);
};
