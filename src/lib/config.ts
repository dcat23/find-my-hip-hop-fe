import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]),
  DATABASE_URL: z.string().url(),
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  NEXT_PUBLIC_ROOT_DOMAIN: z.string().url(),
  NEXT_PUBLIC_VERCEL_ENV: z.boolean(),
  BACKEND_URL: z.string().url(),
});

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}

export const NODE_ENV = process.env.NODE_ENV;
export const DATABASE_URL = process.env.DATABASE_URL;
export const BACKEND_URL = process.env.BACKEND_URL;
export const NEXT_PUBLIC_ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN;
export const NEXT_PUBLIC_VERCEL_ENV = process.env.NEXT_PUBLIC_VERCEL_ENV;
