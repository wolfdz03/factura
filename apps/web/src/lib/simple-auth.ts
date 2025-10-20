import { db } from "@invoicely/db";
import { users } from "@invoicely/db/schema/user";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key-change-in-production");

export interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
  allowedSavingData: boolean;
}

export interface Session {
  user: User | null;
  isAuthenticated: boolean;
}

export async function createSession(user: User): Promise<string> {
  const token = await new SignJWT({ userId: user.id, email: user.email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);

  return token;
}

export async function verifySession(token: string): Promise<Session> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = payload.userId as string;

    const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    
    if (user.length === 0) {
      return { user: null, isAuthenticated: false };
    }

    return {
      user: {
        id: user[0].id,
        email: user[0].email,
        name: user[0].name,
        image: user[0].image,
        createdAt: user[0].createdAt,
        updatedAt: user[0].updatedAt,
        allowedSavingData: user[0].allowedSavingData,
      },
      isAuthenticated: true,
    };
  } catch {
    return { user: null, isAuthenticated: false };
  }
}

export async function getServerSession(): Promise<Session> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;

  if (!token) {
    return { user: null, isAuthenticated: false };
  }

  return await verifySession(token);
}

export async function signIn(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const user = await db.select().from(users).where(eq(users.email, email)).limit(1);
    
    if (user.length === 0) {
      return { success: false, error: "Invalid credentials" };
    }

    const isValidPassword = await bcrypt.compare(password, user[0].password);
    
    if (!isValidPassword) {
      return { success: false, error: "Invalid credentials" };
    }

    const userData = {
      id: user[0].id,
      email: user[0].email,
      name: user[0].name,
      image: user[0].image,
      createdAt: user[0].createdAt,
      updatedAt: user[0].updatedAt,
      allowedSavingData: user[0].allowedSavingData,
    };

    return { success: true, user: userData };
  } catch {
    return { success: false, error: "An error occurred during login" };
  }
}

export async function signOut(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("auth-token");
}
