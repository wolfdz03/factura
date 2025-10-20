# User Management

This document explains how to manage users for the internal invoicing tool.

## Creating Users

### Prerequisites
1. Set up your environment variables (DATABASE_URL)
2. Install dependencies: `yarn install`
3. Run database migrations: `yarn db:push`

### Adding a New User

Use the create-user script to add users to the database:

```bash
cd packages/db
yarn create-user <email> <password> <name>
```

**Example:**
```bash
yarn create-user admin@company.com mypassword123 "Admin User"
```

### User Creation Process
1. The script checks if a user with the email already exists
2. Passwords are automatically hashed using bcryptjs
3. Users are created with `emailVerified: true` (internal tool)
4. The script provides confirmation of successful user creation

### Database Schema
Users are stored in the `users` table with the following fields:
- `id`: UUID (auto-generated)
- `name`: User's display name
- `email`: Login email (unique)
- `password`: Hashed password
- `emailVerified`: Boolean (always true for internal users)
- `image`: Optional profile image
- `createdAt`: Timestamp
- `updatedAt`: Timestamp
- `allowedSavingData`: Boolean for data sync preferences

### Security Notes
- Passwords are hashed with bcryptjs using 12 rounds
- Email addresses must be unique
- Passwords must be at least 6 characters long
- Users are automatically marked as email verified

### Troubleshooting
- **"User already exists"**: The email is already in use
- **"Invalid email format"**: Check email format
- **"Password too short"**: Use at least 6 characters
- **Database connection errors**: Verify DATABASE_URL is set correctly

