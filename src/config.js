import dotenv from 'dotenv';
dotenv.config();


export const cfg = {
port: Number(process.env.PORT || 8080),
accountsBase: process.env.ZOHO_ACCOUNTS_BASE || 'https://accounts.zoho.com',
crmBase: process.env.ZOHO_CRM_BASE || 'https://www.zohoapis.com/crm/v6',
crmModule: process.env.ZOHO_CRM_MODULE || 'Purchase_Orders',
clientId: process.env.ZOHO_CLIENT_ID,
clientSecret: process.env.ZOHO_CLIENT_SECRET,
refreshToken: process.env.ZOHO_REFRESH_TOKEN,
logPretty: process.env.LOG_PRETTY === 'true',
mail: {
host: process.env.MAIL_HOST,
port: Number(process.env.MAIL_PORT || 587),
secure: process.env.MAIL_SECURE === 'true',
user: process.env.MAIL_USER,
pass: process.env.MAIL_PASS,
from: process.env.MAIL_FROM || 'no-reply@localhost',
},
branding: {
name: process.env.COMPANY_NAME || 'Sming Group',
logo: process.env.COMPANY_LOGO_URL || '',
},
};