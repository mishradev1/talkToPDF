// import type { Config } from 'drizzle-kit';
// import * as dotenv from 'dotenv';
// dotenv.config({path: ".env"});

// export default {
//     driver: "pg",
//     schema: "./src/lib/db/schema.ts",
//     dbCredentials: {
//         connectionString: process.env.DATABASE_URL! ,
//     }
// } satisfies Config;

// npx drizzle-kit push:pg

import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './src/lib/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});