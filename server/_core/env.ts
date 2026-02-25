export const ENV = {
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  isProduction: process.env.NODE_ENV === "production",
  adminEmail: process.env.ADMIN_EMAIL ?? "admin@jevalis.com",
  adminPassword: process.env.ADMIN_PASSWORD ?? "",
  appUrl: process.env.APP_URL ?? "https://jevalis.com",
  resendApiKey: process.env.RESEND_API_KEY ?? "",
  resendFrom: process.env.RESEND_FROM_EMAIL ?? "rapports@jevalis.com",
  resendFromName: process.env.RESEND_FROM_NAME ?? "Jevalis",
  supabaseUrl: process.env.SUPABASE_URL ?? "",
  supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  supabaseBucket: process.env.SUPABASE_BUCKET ?? "jevalis-reports",
};
