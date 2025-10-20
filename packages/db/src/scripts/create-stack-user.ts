#!/usr/bin/env node

import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";

// This script creates users directly in the stack_auth.users table
// which is automatically created by Stack Auth

async function createStackUser(email: string, password: string, name: string) {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is not set");
    }

    const sql = neon(process.env.DATABASE_URL);

    // Check if user already exists
    const existingUser = await sql`
      SELECT id FROM stack_auth.users 
      WHERE email = ${email}
    `;
    
    if (existingUser.length > 0) {
      console.log(`❌ User with email ${email} already exists`);
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create the user in stack_auth.users table
    const newUser = await sql`
      INSERT INTO stack_auth.users (
        id,
        email,
        password,
        display_name,
        email_verified,
        created_at,
        updated_at
      ) VALUES (
        gen_random_uuid(),
        ${email},
        ${hashedPassword},
        ${name},
        true,
        now(),
        now()
      )
      RETURNING id, email, display_name, created_at
    `;

    console.log(`✅ User created successfully in stack_auth.users:`);
    console.log(`   ID: ${newUser[0].id}`);
    console.log(`   Name: ${newUser[0].display_name}`);
    console.log(`   Email: ${newUser[0].email}`);
    console.log(`   Created: ${newUser[0].created_at}`);
  } catch (error) {
    console.error("❌ Error creating user:", error);
  }
}

// Get command line arguments
const args = process.argv.slice(2);

if (args.length !== 3) {
  console.log("Usage: node create-stack-user.ts <email> <password> <name>");
  console.log("Example: node create-stack-user.ts admin@company.com password123 \"Admin User\"");
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
createStackUser(email, password, name).then(() => {
  process.exit(0);
});
