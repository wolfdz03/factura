import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuth } from "better-auth";
import { db } from "@invoicely/db";

export const serverAuth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  user: {
    modelName: "users",
    additionalFields: {
      allowedSavingData: {
        type: "boolean",
        required: false,
        defaultValue: false,
        fieldName: "allowedSavingData",
        returned: true,
      },
    },
  },
  account: {
    modelName: "accounts",
  },
  session: {
    modelName: "sessions",
  },
  verification: {
    modelName: "verifications",
  },
  advanced: {
    database: {
      generateId: false,
    },
    ipAddress: {
      ipAddressHeaders: ["cf-connecting-ip"],
    },
  },
});
