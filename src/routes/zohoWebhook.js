import { cfg } from '../config.js';
import { getPoRecord, uploadNoteWithFile } from '../zoho.js';
import { renderPoPdf } from '../pdf.js';   // << ใช้ named export
import { sendEmail } from '../email.js';


export default async function zohoWebhookRoute(fastify) {
fastify.post('/zoho/webhook', async (req, reply) => {
try {
const { record_id, module = cfg.crmModule, email_fallback } = req.body || {};
if (!record_id) return reply.code(400).send({ error: 'record_id is required' });


const { rec, lineItems } = await getPoRecord(record_id);
if (!rec || !rec.id) return reply.code(404).send({ error: 'PO not found in CRM' });


const pdf = await renderPoPdf(rec, lineItems);
const fname = `${rec.PO_Number || rec.Name || 'PO'}.pdf`;


await uploadNoteWithFile(module, rec.id, fname, pdf);


const vendorEmail = rec.Vendor?.email || rec.Vendor_Email || email_fallback;
if (vendorEmail) {
await sendEmail(
vendorEmail,
`Purchase Order ${rec.PO_Number || rec.Name || ''}`,'เรียนผู้ขาย โปรดดูไฟล์ PO แนบมานี้ค่ะ/ครับ',


'ขอบคุณครับ/ค่ะ',
[{ filename: fname, content: pdf }]
);
}


return { ok: true, uploaded_note: true, emailed: Boolean(vendorEmail) };
} catch (err) {
req.log.error(err);
return reply.code(500).send({ error: err.message });
}
});
}