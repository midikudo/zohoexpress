import axios from 'axios';
async function authHeaders(extra = {}) {
const token = await getAccessToken();
return { Authorization: `Zoho-oauthtoken ${token}`, ...extra };
}


export async function crmGet(pathUrl, params = {}) {
const url = `${cfg.crmBase}${pathUrl}`;
const { data } = await axios.get(url, { params, headers: await authHeaders() });
return data;
}


export async function crmPost(pathUrl, payload, headersExtra = {}) {
const url = `${cfg.crmBase}${pathUrl}`;
const { data } = await axios.post(url, payload, { headers: await authHeaders(headersExtra) });
return data;
}

export async function getPoRecord(recordId) {
const pathUrl = `/${encodeURIComponent(cfg.crmModule)}/${encodeURIComponent(recordId)}`;
const data = await crmGet(pathUrl);
const rec = data?.data?.[0] || {};
const lineItems = rec.PO_Line_Items || rec.Line_Items || rec.Products || [];
return { rec, lineItems };
}


export async function uploadNoteWithFile(parentModule, parentId, filename, buffer) {
const url = `${cfg.crmBase}/Notes`;
const form = new FormData();
const note = {
Note_Title: 'PO PDF',
Note_Content: 'Auto-generated PO PDF',
Parent_Id: parentId,
se_module: parentModule,
};
form.append('file', buffer, { filename });
form.append('data', JSON.stringify({ data: [note] }));
const { data } = await axios.post(url, form, { headers: await authHeaders(form.getHeaders()) });
return data;
}



// ## src/utils/html.js
export function escapeHtml(s) {
return String(s || '').replace(/[&<>"']/g, (c) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;' }[c]));
}