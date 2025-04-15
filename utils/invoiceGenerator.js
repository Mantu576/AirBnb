const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generateInvoice = async (booking) => {
  const invoiceDir = path.join(__dirname, '..', 'invoices');
  if (!fs.existsSync(invoiceDir)) {
    fs.mkdirSync(invoiceDir);
  }

  const invoicePath = path.join(invoiceDir, `invoice-${booking._id}.pdf`);
  const doc = new PDFDocument();

  doc.pipe(fs.createWriteStream(invoicePath));

  // Add invoice content
  doc.fontSize(20).text('AirBnb Booking Invoice', { align: 'center' });
  
  doc.moveDown();
  doc.fontSize(12).text(`Invoice Number: ${booking._id}`);
  doc.text(`Booking Date: ${new Date().toLocaleDateString()}`);
  doc.text(`Check In: ${new Date(booking.checkIn).toLocaleDateString()}`);
  doc.text(`Check Out: ${new Date(booking.checkOut).toLocaleDateString()}`);
  doc.text(`Guests: ${booking.guests}`);
  doc.text(`Total Amount: ₹${booking.price}`);
  doc.moveDown();
  doc.text('Thank you for booking with us!', { align: 'center' });

  doc.end();

  return `/invoices/invoice-${booking._id}.pdf`; // Return relative path for the client
};

module.exports = generateInvoice;