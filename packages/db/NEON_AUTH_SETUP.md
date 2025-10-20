# Stack Auth Setup Guide

This document explains how to set up and use Stack Auth for the internal invoicing tool.

## Prerequisites

1. **Stack Auth Setup:**
   - Go to [Stack Auth Console](https://console.stack-auth.com)
   - Create a new project
   - Copy the generated environment variables

2. **Environment Variables:**
   Add these to your `.env.local` file:
   ```env
   NEXT_PUBLIC_STACK_PROJECT_ID=your_project_id
   NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=your_client_key
   STACK_SECRET_SERVER_KEY=your_secret_key
   DATABASE_URL=your_database_url
   ```

## Database Schema

Stack Auth automatically creates a `stack_auth.users` table in your database. This table contains:
- `id`: UUID (auto-generated)
- `email`: User's email (unique)
- `password`: Hashed password
- `display_name`: User's display name
- `email_verified`: Boolean
- `created_at`: Timestamp
- `updated_at`: Timestamp

## Creating Users

### Using the Script

```bash
cd packages/db
yarn create-stack-user <email> <password> <name>
```

**Example:**
```bash
yarn create-stack-user admin@company.com mypassword123 "Admin User"
```

### Manual Database Insert

You can also insert users directly into the `stack_auth.users` table:

```sql
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
  'admin@company.com',
  '$2a$12$hashed_password_here',
  'Admin User',
  true,
  now(),
  now()
);
```

## Authentication Flow

1. **Login Page:** `/login` - Users enter email/password
2. **Authentication:** Stack Auth validates credentials against `stack_auth.users`
3. **Session Management:** Stack Auth handles session tokens automatically
4. **Dashboard Access:** Authenticated users are redirected to `/invoices`

## Key Features

- **Automatic Password Hashing:** Passwords are hashed with bcryptjs
- **Session Management:** Built-in session handling with Stack Auth
- **User Sync:** User data is automatically synced to your Neon database
- **Security:** Industry-standard security practices

## Troubleshooting

### Common Issues

1. **"Environment variables not set"**
   - Ensure all required environment variables are in `.env.local`
   - Restart your development server after adding variables

2. **"User not found"**
   - Verify user exists in `neon_auth.users_sync` table
   - Check email spelling and case sensitivity

3. **"Authentication failed"**
   - Verify password is correct
   - Check if user account is active

### Database Connection

If you need to check the `stack_auth.users` table:

```sql
SELECT * FROM stack_auth.users;
```

## Migration from Better Auth

The migration from Better Auth to Stack Auth includes:
- ✅ Removed Better Auth configuration
- ✅ Added Stack Auth configuration
- ✅ Updated login page to use Stack Auth
- ✅ Updated sidebar navigation
- ✅ Created user management scripts
- ✅ Updated home page authentication check

## Next Steps

1. Set up Neon Auth in your Neon console
2. Add environment variables to `.env.local`
3. Create your first user with the script
4. Test the authentication flow
5. Deploy and configure production environment variables
