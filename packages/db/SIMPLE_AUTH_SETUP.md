# Simple Authentication Setup Guide

This document explains how to set up and manage users for the internal invoicing tool using the simple authentication system.

## Prerequisites

1. **Database Setup:**
   - Ensure your Neon database is running
   - Run database migrations: `yarn db:push`
   - Set up your `DATABASE_URL` environment variable

2. **Environment Variables:**
   Add these to your `.env.local` file:
   ```env
   DATABASE_URL=your_database_url
   JWT_SECRET=your_jwt_secret_key_change_in_production
   ```

## Creating Users

### Method 1: Using the Simple Script (Recommended)

```bash
cd packages/db
DATABASE_URL=your_database_url yarn create-simple-user <email> <password> <name>
```

**Example:**
```bash
DATABASE_URL=postgresql://user:pass@host/db yarn create-simple-user admin@company.com password123 "Admin User"
```

### Method 2: Direct Database Access

You can also insert users directly into the `users` table using any PostgreSQL client:

```sql
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
  'admin@company.com',
  '$2a$12$hashed_password_here',
  'Admin User',
  true,
  now(),
  now(),
  false
);
```

**Note:** You'll need to hash the password using bcryptjs with 12 rounds.

### Method 3: Using Drizzle Studio

1. Run: `yarn db:studio`
2. Open the web interface
3. Navigate to the `users` table
4. Add a new record with the required fields

## Database Schema

The `users` table contains:
- `id`: UUID (auto-generated)
- `email`: User's email (unique)
- `password`: Hashed password (bcryptjs, 12 rounds)
- `name`: User's display name
- `email_verified`: Boolean (set to true for internal users)
- `image`: Optional profile image URL
- `created_at`: Timestamp
- `updated_at`: Timestamp
- `allowed_saving_data`: Boolean for data sync preferences

## Authentication Flow

1. **Login Page:** `/login` - Users enter email/password
2. **Authentication:** System validates credentials against `users` table
3. **Session Management:** JWT tokens stored in HTTP-only cookies
4. **Dashboard Access:** Authenticated users are redirected to `/invoices`

## Security Features

- **Password Hashing:** bcryptjs with 12 rounds
- **JWT Tokens:** Secure session management
- **HTTP-Only Cookies:** Prevents XSS attacks
- **Input Validation:** Email format and password length validation

## User Management Commands

### Create a new user:
```bash
cd packages/db
DATABASE_URL=your_url yarn create-simple-user email@company.com password123 "User Name"
```

### Check existing users:
```sql
SELECT id, email, name, created_at FROM users;
```

### Update user password:
```sql
UPDATE users 
SET password = '$2a$12$new_hashed_password' 
WHERE email = 'user@company.com';
```

### Delete a user:
```sql
DELETE FROM users WHERE email = 'user@company.com';
```

## Troubleshooting

### Common Issues

1. **"User already exists"**
   - The email is already in use
   - Use a different email or update the existing user

2. **"Invalid email format"**
   - Check email format (must contain @ and valid domain)

3. **"Password too short"**
   - Use at least 6 characters

4. **"Database connection failed"**
   - Verify DATABASE_URL is correct
   - Check if database is accessible

### Environment Setup

Make sure you have these environment variables set:
```env
DATABASE_URL=postgresql://username:password@host:port/database
JWT_SECRET=your-secret-key-at-least-32-characters-long
```

## Next Steps

1. Set up your environment variables
2. Run database migrations: `yarn db:push`
3. Create your first admin user
4. Test the login flow at `/login`
5. Access the dashboard at `/invoices`

The system is now ready for internal use with simple username/password authentication!
