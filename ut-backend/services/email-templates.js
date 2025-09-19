function baseLayout(content) {
  return `
  <div style="font-family:Arial,Helvetica,sans-serif; color:#111;">
    <div style="max-width:640px;margin:0 auto;border:1px solid #eee;border-radius:8px;overflow:hidden">
      <div style="background:#FCB53B;color:#fff;padding:16px 20px;font-weight:700">UrbanThali</div>
      <div style="padding:20px">${content}</div>
      <div style="background:#fafafa;padding:14px 20px;font-size:12px;color:#555">Thanks for ordering with UrbanThali • orders@urbanthali.com</div>
    </div>
  </div>`;
}

function confirmationTemplate({ name, orderId, itemsHtml, total, address, eta }) {
  return baseLayout(`
    <h2 style="margin:0 0 8px">Hi ${name},</h2>
    <p>Your UrbanThali order <strong>#${orderId}</strong> is confirmed.</p>
    <h3 style="margin:16px 0 8px;font-size:16px">Order Summary</h3>
    <table width="100%" cellspacing="0" cellpadding="6" style="border-collapse:collapse">${itemsHtml}</table>
    <p style="margin:10px 0"><strong>Total:</strong> ₹${Number(total).toFixed(2)}</p>
    <p style="margin:10px 0"><strong>Delivery Address:</strong><br/>${address}</p>
    <p style="margin:10px 0">Expected Delivery Time: <strong>${eta}</strong></p>
    <p style="margin-top:18px">You can track your order in your UrbanThali account.</p>
  `);
}

function deliveredTemplate({ name, orderId, address }) {
  return baseLayout(`
    <h2 style="margin:0 0 8px">Hi ${name},</h2>
    <p>Your UrbanThali order <strong>#${orderId}</strong> has been delivered.</p>
    <p>Delivered to: <strong>${address}</strong></p>
    <p style="margin:14px 0">We hope you enjoyed your meal. Thank you for choosing UrbanThali!</p>
    <p>Rate your experience: <a href="https://urbanthali.com/rate/${orderId}">Click here to rate</a></p>
  `);
}

function itemsToHtmlRows(cart = []) {
  return (cart || [])
    .map((item) => {
      const name = item?.name || item?.title || item?.productName || 'Item';
      const qty = item?.orderQuantity || item?.qty || 1;
      const price = Number(item?.price || item?.unitPrice || 0);
      return `<tr style="border-bottom:1px solid #eee">
        <td>${name}</td>
        <td align="center">${qty}</td>
        <td align="right">₹${price.toFixed(2)}</td>
      </tr>`;
    })
    .join('');
}

module.exports = {
  confirmationTemplate,
  deliveredTemplate,
  itemsToHtmlRows,
};









