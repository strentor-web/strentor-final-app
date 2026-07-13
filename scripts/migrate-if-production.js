// Runs `prisma migrate deploy` only for production builds. Vercel preview
// deployments (one per branch/PR) don't carry production database
// credentials by design, and shouldn't be racing each other to migrate the
// same database anyway — only the production build should apply migrations.
const { execSync } = require("child_process");

if (process.env.VERCEL_ENV === "production") {
  execSync("npx prisma migrate deploy", { stdio: "inherit" });
} else {
  console.log(
    `Skipping prisma migrate deploy (VERCEL_ENV=${process.env.VERCEL_ENV ?? "undefined"}, not production)`
  );
}
