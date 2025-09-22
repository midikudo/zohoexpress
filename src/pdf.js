// src/pdf.js
import puppeteer from 'puppeteer';
import dayjs from 'dayjs';
import { cfg } from './config.js';
import { escapeHtml } from './utils/html.js';

export async function renderPoPdf(po, lineItems) {
  const html = buildPoHtml(po, lineItems);
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  const pdf = await page.pdf({ format: 'A4', printBackground: true, margin: { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' } });
  await browser.close();
  return pdf;
}

export function buildPoHtml(po, items) {
  const logo = cfg.branding.logo
    ? `<img src="${cfg.branding.logo}" alt="logo" style="height:40px;"/>`
    : '';

  const rows = (items || [])
    .map(
      (it, idx) => `
        <tr>
          <td style="padding:8px;border:1px solid #ddd;">${idx + 1}</td>
          <td style="padding:8px;border:1px solid #ddd;">${escapeHtml(it.Description || it.Product_Name || '')}</td>
          <td style="padding:8px;border:1px solid #ddd;text-align:right;">${Number(it.Qty || it.Quantity || 0).toLocaleString()}</td>
          <td style="padding:8px;border:1px solid #ddd;text-align:right;">${Number(it.Unit_Price || it.Rate || 0).toFixed(2)}</td>
          <td style="padding:8px;border:1px solid #ddd;text-align:right;">${Number(it.Line_Total || ((it.Qty || 0) * (it.Unit_Price || 0)) || 0).toFixed(2)}</td>
        </tr>`
    )
    .join('');

  const subtotal = Number(po.Subtotal || 0);
  const tax = Number(po.Tax || 0);
  const shipping = Number(po.Shipping || 0);
  const discount = Number(po.Discount || 0);
  const total = Number(po.Total || subtotal + tax + shipping - discount);

  return `
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>PO ${escapeHtml(po.PO_Number || po.Name || '')}</title>
  <style>
    body { font-family: Arial, Helvetica, sans-serif; font-size: 12px; color: #222; }
    h1 { font-size: 18px; margin: 0; }
    .muted { color: #666; }
    table { border-collapse: collapse; width: 100%; }
  </style>
</head>
<body>
  <table style="width:100%;">
    <tr>
      <td>${logo}</td>
      <td style="text-align:right;">
        <h1>${escapeHtml(cfg.branding.name)} – Purchase Order</h1>
        <div class="muted">Date: ${dayjs(po.PO_Date || po.Created_Time).format('YYYY-MM-DD')}</div>
        <div class="muted">PO No.: ${escapeHtml(po.PO_Number || po.Name || '')}</div>
      </td>
    </tr>
  </table>

  <hr/>

  <table style="width:100%; margin-top:8px;">
    <tr>
      <td style="vertical-align:top; width:50%"><strong>Vendor</strong><br/>
        ${escapeHtml(po.Vendor_Name || po.Vendor || '')}<br/>
        ${escapeHtml(po.Vendor_Email || '')}
      </td>
      <td style="vertical-align:top; width:50%"><strong>Bill To</strong><br/>
        ${escapeHtml(po.Bill_To || '')}
      </td>
    </tr>
  </table>

  <h3 style="margin-top:16px;">Items</h3>
  <table>
    <thead>
      <tr>
        <th style="padding:8px;border:1px solid #ddd;">#</th>
        <th style="padding:8px;border:1px solid #ddd;">Description</th>
        <th style="padding:8px;border:1px solid #ddd;">Qty</th>
        <th style="padding:8px;border:1px solid #ddd;">Unit Price</th>
        <th style="padding:8px;border:1px solid #ddd;">Line Total</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
    </tbody>
  </table>

  <table style="width:40%; margin-left:auto; margin-top:10px;">
    <tr><td>Subtotal</td><td style="text-align:right;">${subtotal.toFixed(2)}</td></tr>
    <tr><td>Tax</td><td style="text-align:right;">${tax.toFixed(2)}</td></tr>
    <tr><td>Shipping</td><td style="text-align:right;">${shipping.toFixed(2)}</td></tr>
    <tr><td>Discount</td><td style="text-align:right;">-${discount.toFixed(2)}</td></tr>
    <tr><td colspan="2"><hr/></td></tr>
    <tr><td><strong>Total</strong></td><td style="text-align:right;"><strong>${total.toFixed(2)}</strong></td></tr>
  </table>

  <p class="muted" style="margin-top:16px;">Payment Terms: ${escapeHtml(po.Payment_Terms || '')}</p>
</body>
</html>`;
}
