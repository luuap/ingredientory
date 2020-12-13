import serverless from 'serverless-http';
import { createApp } from './app';

export async function handler(event: any, context: any) {
  const app = await createApp(process.env.MONGO_URI!);
  return serverless(app.server)(event, context);
}
