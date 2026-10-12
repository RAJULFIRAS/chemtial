import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

console.log("Testing SMTP with:");
console.log("  Host:", process.env.SMTP_HOST);
console.log("  Port:", process.env.SMTP_PORT);
console.log("  User:", process.env.SMTP_USER);
console.log("  Pass length:", process.env.SMTP_PASS?.length);

const transport = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

transport.verify((error, success) => {
  if (error) {
    console.error("SMTP verify FAILED:", error.message);
    process.exit(1);
  } else {
    console.log("SMTP verify SUCCESS — credentials are valid");
    process.exit(0);
  }
});
