import serverless from 'serverless-http';
import { createApp, Ingredientory } from './app';

let app: Ingredientory | null = null; // put app outside so lambda would be able to reuse it

export async function handler(event: any, context: any) {
  context.callbackWaitsForEmptyEventLoop = false;
  if (app === null) {
    app = await createApp(process.env.MONGO_URI!);
  } 
  return serverless(app.server)(event, context);
}
