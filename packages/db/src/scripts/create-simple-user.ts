#!/usr/bin/env node

import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";

// Simple script to create users - only needs DATABASE_URL
async function createSimpleUser(email: string, password: string, name: string) {
  try {
    if (!process.env.DATABASE_URL) {
      console.log("❌ Please set DATABASE_URL environment variable");
      console.log("Example: DATABASE_URL=your_connection_string yarn create-simple-user email password name");
      process.exit(1);
    }

    const sql = neon(process.env.DATABASE_URL);

    // Check if user already exists
    const existingUser = await sql`
      SELECT id FROM users 
      WHERE email = ${email}
    `;
    
    if (existingUser.length > 0) {
      console.log(`❌ User with email ${email} already exists`);
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create the user
    const newUser = await sql`
      INSERT INTO users (
        id,
        email,
        password,
        name,
        email_verified,
        created_at,
        updated_at,
        allowed_saving_data
      ) VALUES (
        gen_random_uuid(),
        ${email},
        ${hashedPassword},
        ${name},
        true,
        now(),
        now(),
        true
      )
      RETURNING id, email, name, created_at
    `;

    console.log(`✅ User created successfully:`);
    console.log(`   ID: ${newUser[0].id}`);
    console.log(`   Name: ${newUser[0].name}`);
    console.log(`   Email: ${newUser[0].email}`);
    console.log(`   Created: ${newUser[0].created_at}`);
  } catch (error) {
    console.error("❌ Error creating user:", error);
  }
}

// Get command line arguments
const args = process.argv.slice(2);

if (args.length !== 3) {
  console.log("Usage: DATABASE_URL=your_url yarn create-simple-user <email> <password> <name>");
  console.log("Example: DATABASE_URL=postgresql://... yarn create-simple-user admin@company.com password123 \"Admin User\"");
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
createSimpleUser(email, password, name).then(() => {
  process.exit(0);
});
