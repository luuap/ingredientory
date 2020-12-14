import http from 'http';
import { createApp } from './app';

let server: http.Server;

const isDevelopment = process.env.NODE_ENV === 'development';

async function getDatabaseURI(): Promise<string> {

  // Poll every second during development to account for possible race condition where server 
  // will try to connect before db has finished starting up due to unfavorable task scheduling or first set-up (downloading mongodb binaries)
  if (isDevelopment) {
    let seconds = 0;
    while (process.env.MONGO_URI === undefined && seconds < 7200) { // 2h limit
      await new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });
      seconds += 1;
    }
  }

  return process.env.MONGO_URI ?? Promise.reject('MONGO_URI environment variable is not set');
}

function terminateApp(signalOrCode: NodeJS.Signals | number) {

  if (typeof signalOrCode === 'string') {
    console.log(`Process ${process.pid} received a ${signalOrCode} signal`);
  }

  server.close(() => {
    console.log('Closing app http server');
  });

}

function exitHandler(exitCode: number) {
  console.log(`Exiting with code ${exitCode}`);
}

// Note: project configurations for top-level await does not play well with ts-node https://github.com/TypeStrong/ts-node/issues/1007
//       so we will have to wrap everything in async functions for now
getDatabaseURI().then(async mongoURI => {

  const app = await createApp(mongoURI);

  server = app.listen(8080);

}).catch(err => {
  console.error('Stopping app due to error:');
  console.error(err);
  process.exit(1);
});

process.on('SIGINT', terminateApp);
process.on('exit', exitHandler);
