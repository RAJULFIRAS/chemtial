import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const prisma = new PrismaClient();

interface Args {
  email: string;
  password: string;
  name: string;
}

function parseArgs(): Args {
  const args = process.argv.slice(2);
  const parsed: Partial<Args> = {};

  for (const arg of args) {
    const [key, value] = arg.split("=");
    if (key === "--email") parsed.email = value;
    if (key === "--password") parsed.password = value;
    if (key === "--name") parsed.name = value;
  }

  if (!parsed.email || !parsed.password || !parsed.name) {
    console.error(`
    Usage:
      npm run db:create-manager -- --email=Themanager00@chemtial.com --password=Theonlyone123. --name="Rajul Viras"

    Required:
      --email     Email manager (harus valid dan unik)
      --password  Password (min 8 char, huruf besar, kecil, angka, simbol)
      --name      Nama lengkap manager
    `);
    process.exit(1);
  }

  return parsed as Args;
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password: string): boolean {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
  return regex.test(password);
}

async function main() {
  const { email, password, name } = parseArgs();

  console.log("\n[*] Creating manager account...\n");

  if (!validateEmail(email)) {
    console.error("[X] Invalid email format:", email);
    process.exit(1);
  }

  if (!validatePassword(password)) {
    console.error(
      "[X] Password must be at least 8 characters with uppercase, lowercase, number, and special character.",
    );
    process.exit(1);
  }

  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    console.error(`[X] User with email ${email} already exists.`);
    console.error(`    Existing role: ${existing.role}`);
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      id: crypto.randomUUID(),
      email,
      passwordHash,
      name,
      role: "manager",
      isActive: true,
    },
  });

  console.log("[OK] Manager account created successfully.\n");
  console.log("----------------------------------------");
  console.log("Email:   ", user.email);
  console.log("Name:    ", user.name);
  console.log("Role:    ", user.role);
  console.log("ID:      ", user.id);
  console.log("Created: ", user.createdAt.toISOString());
  console.log("----------------------------------------\n");
  console.log("[!] Change the password after first login!\n");
}

main()
  .catch((error) => {
    console.error("[X] Failed to create manager:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
