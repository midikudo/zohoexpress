import nodemailer from 'nodemailer';
import { cfg } from './config.js';


function buildTransporter() {
if (!cfg.mail.host) return null;
return nodemailer.createTransport({
host: cfg.mail.host,
port: cfg.mail.port,
secure: cfg.mail.secure,
auth: cfg.mail.user ? { user: cfg.mail.user, pass: cfg.mail.pass } : undefined,
});
}


export async function sendEmail(to, subject, text, attachments = []) {
const t = buildTransporter();
if (!t) return { skipped: true };
return t.sendMail({ from: cfg.mail.from, to, subject, text, attachments });
}