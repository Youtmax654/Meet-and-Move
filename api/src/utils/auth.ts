import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { emailOTP } from "better-auth/plugins";
import * as schema from "../db/schema";
import { sendOtpEmail } from "./email/index";
import { expo } from "@better-auth/expo";
import { db } from "../db/index";

export const auth = betterAuth({
  basePath: "/auth",
  trustedOrigins: ["meetandmove://", "http://localhost:8081", "*"],
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
    schema,
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    apple: {
      clientId: process.env.APPLE_CLIENT_ID!,
      clientSecret: process.env.APPLE_CLIENT_SECRET!,
    },
  },
  plugins: [
    expo(),
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        await sendOtpEmail({ email, otp, type });
      },
    }),
  ],
  advanced: {
    database: {
      generateId: () => crypto.randomUUID(),
    },
    crossSubDomainCookies: {
      enabled: true,
    },
  },
});
