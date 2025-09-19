const PDFDocument = require('pdfkit');
const { Readable } = require('stream');

/**
 * Generate a PDF invoice as a Buffer
 * @param {Object} order - Order document
 * @returns {Promise<Buffer>}
 */
function generateInvoiceBuffer(order) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const chunks = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // Header
    doc
      .fontSize(22)
      .fillColor('#000')
      .text('UrbanThali', { continued: true })
      .fillColor('#FCB53B')
      .text(' — Invoice', { align: 'right' });

    doc.moveDown(0.5);
    doc.fontSize(10).fillColor('#333').text('UrbanThali, New Delhi, India');
    doc.text('orders@urbanthali.com');
    doc.moveDown();

    // Customer & Meta
    doc.fillColor('#000').fontSize(12).text(`Invoice #: ${order.invoice}`);
    doc.text(`Order ID: ${order._id}`);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`);
    doc.moveDown();

    doc.text(`Bill To: ${order.name}`);
    doc.text(order.email);
    doc.text(order.address);
    doc.moveDown();

    // Table Header
    doc.font('Helvetica-Bold');
    doc.text('Item', 50, doc.y);
    doc.text('Qty', 320, doc.y);
    doc.text('Price', 370, doc.y);
    doc.text('Total', 450, doc.y);
    doc.moveDown(0.5);
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();

    // Items
    doc.font('Helvetica');
    (order.cart || []).forEach((item) => {
      const name = item?.name || item?.title || item?.productName || 'Item';
      const qty = item?.orderQuantity || item?.qty || 1;
      const price = Number(item?.price || item?.unitPrice || 0);
      const total = qty * price;
      doc.text(name, 50, doc.y + 8, { width: 260 });
      doc.text(String(qty), 320, doc.y);
      doc.text(price.toFixed(2), 370, doc.y);
      doc.text(total.toFixed(2), 450, doc.y);
      doc.moveDown();
    });

    doc.moveDown();
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();

    // Totals
    const subtotal = Number(order.subTotal || 0);
    const tax = Math.round(subtotal * 0.05 * 100) / 100; // 5% GST example
    const shipping = Number(order.shippingCost || 0);
    const discount = Number(order.discount || 0);
    const grandTotal = Number(order.totalAmount || subtotal + tax + shipping - discount);

    const right = 450;
    doc.text('Subtotal:', right, doc.y + 8);
    doc.text(subtotal.toFixed(2), 520, doc.y);
    doc.text('Tax (5%):', right, doc.y + 16);
    doc.text(tax.toFixed(2), 520, doc.y);
    doc.text('Shipping:', right, doc.y + 24);
    doc.text(shipping.toFixed(2), 520, doc.y);
    doc.text('Discount:', right, doc.y + 32);
    doc.text(discount.toFixed(2), 520, doc.y);
    doc.font('Helvetica-Bold');
    doc.text('Total:', right, doc.y + 40);
    doc.text(grandTotal.toFixed(2), 520, doc.y);
    doc.font('Helvetica');

    doc.moveDown(2);
    doc.text('Delivery Address:', 50);
    doc.text(order.address);
    doc.moveDown();

    doc.text('Thank you for ordering with UrbanThali!');
    doc.text('Please rate your experience: https://urbanthali.com/rate/' + order._id);

    doc.end();
  });
}

module.exports = { generateInvoiceBuffer };









