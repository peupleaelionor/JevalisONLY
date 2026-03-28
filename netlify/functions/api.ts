import serverless from "serverless-http";
import app from "../../server/_core/app";

export const handler = serverless(app);
