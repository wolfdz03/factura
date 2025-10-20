#!/usr/bin/env node

import { db } from "../index";
import { users } from "../schema/user";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

async function createUser(email: string, password: string, name: string) {
  try {
    // Check if user already exists
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
    
    if (existingUser.length > 0) {
      console.log(`❌ User with email ${email} already exists`);
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create the user
    const newUser = await db.insert(users).values({
      email,
      password: hashedPassword,
      name,
      emailVerified: true, // Since this is internal, mark as verified
    }).returning();

    console.log(`✅ User created successfully:`);
    console.log(`   ID: ${newUser[0].id}`);
    console.log(`   Name: ${newUser[0].name}`);
    console.log(`   Email: ${newUser[0].email}`);
    console.log(`   Created: ${newUser[0].createdAt}`);
  } catch (error) {
    console.error("❌ Error creating user:", error);
  }
}

// Get command line arguments
const args = process.argv.slice(2);

if (args.length !== 3) {
  console.log("Usage: node create-user.ts <email> <password> <name>");
  console.log("Example: node create-user.ts admin@company.com password123 \"Admin User\"");
  process.exit(1);
}

const [email, password, name] = args;

// Validate email format
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  console.log("❌ Invalid email format");
  process.exit(1);
}

// Validate password length
if (password.length < 6) {
  console.log("❌ Password must be at least 6 characters long");
  process.exit(1);
}

// Create the user
createUser(email, password, name).then(() => {
  process.exit(0);
});

