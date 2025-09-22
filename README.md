## README.md (ขั้นตอนติดตั้งและใช้งาน)
```md
# Sming PO Webhook (Node.js + Fastify + Zoho)


## ติดตั้ง (ตั้งแต่เริ่ม)
1. คลอนโปรเจกต์นี้ หรือสร้างโฟลเดอร์ใหม่ให้โครงสร้างตามไฟล์ด้านบน
2. สร้างไฟล์ `.env` จากตัวอย่าง
```bash
cp .env.example .env
# เติมค่า OAuth/SMTP/Branding ให้ครบ
```
3. ติดตั้งแพ็กเกจ
```bash
npm i
npm run dev
# หรือรันจริง
npm start
```
4. ทดสอบ Health
```
GET http://localhost:8080/health
```
5. (ทางเลือก) ทดสอบสร้าง PDF ของ PO จริงจาก Zoho CRM
```
GET http://localhost:8080/debug/pdf/<CRM_RECORD_ID>
```
6. ตั้งค่า Webhook ใน Zoho (Workflow/Blueprint → Webhook)
- URL: `POST https://<your-host>/zoho/webhook`
- Header: `Content-Type: application/json`
- Body (JSON):
```json
{"record_id":"${ID}","module":"Purchase_Orders"}
```


## รันด้วย Docker
```bash
docker compose up --build -d
```


## หมายเหตุสำคัญ
- สำหรับภูมิภาค EU/IN ให้เปลี่ยนโดเมน `ZOHO_ACCOUNTS_BASE` และ `ZOHO_CRM_BASE` เป็น *.eu / *.in
- ถ้าโมดูล/ฟิลด์ไม่ตรง ให้ปรับ mapping ใน `src/zoho.js` และ `src/pdf.js`
- ถ้าเซิร์ฟเวอร์ที่ใช้ไม่มีสิทธิ์ sandbox ให้ย้ายไปใช้ `puppeteer` พร้อม chromium ใน Dockerfile (ตั้งไว้แล้ว)
```