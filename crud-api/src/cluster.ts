import cluster, { Worker } from 'cluster';
import os from 'os';
import http, { IncomingMessage, ServerResponse } from 'http';
import { config } from 'dotenv';
import { requestListener } from './app';
import { usersStore } from './users/users.store';
import { User } from './users/users.types';

config();

const basePort = Number(process.env.PORT) || 4000;

if (cluster.isPrimary) {
  const workersCount = Math.max(os.availableParallelism() - 1, 1);
  const workers: Worker[] = [];

  for (let i = 0; i < workersCount; i++) {
    const workerPort = basePort + i + 1;
    const worker = cluster.fork({ PORT: workerPort.toString() });
    workers.push(worker);
  }

  cluster.on('message', (worker, message: { type?: string; payload?: unknown }) => {
    if (message?.type === 'sync-users') {
      const payload = message.payload as User[];
      workers.forEach((w) => {
        if (w.id !== worker.id) {
          w.send({ type: 'sync-users', payload });
        }
      });
    }
  });

  let currentIndex = 0;

  const loadBalancer = http.createServer(
    (req: IncomingMessage, res: ServerResponse) => {
      if (!req.url || !req.method) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Invalid request' }));
        return;
      }

      if (workers.length === 0) {
        res.writeHead(503, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'No workers available' }));
        return;
      }

      const targetIndex = currentIndex;
      currentIndex = (currentIndex + 1) % workers.length;
      const targetPort = basePort + targetIndex + 1;

      const proxyRequest = http.request(
        {
          hostname: '127.0.0.1',
          port: targetPort,
          path: req.url,
          method: req.method,
          headers: req.headers,
        },
        (proxyResponse) => {
          res.writeHead(proxyResponse.statusCode ?? 500, proxyResponse.headers);
          proxyResponse.pipe(res);
        },
      );

      proxyRequest.on('error', (error) => {
        console.error('Proxy error:', error);
        if (!res.headersSent) {
          res.writeHead(502, { 'Content-Type': 'application/json' });
        }
        res.end(JSON.stringify({ message: 'Failed to proxy request' }));
      });

      req.pipe(proxyRequest);
    },
  );

  loadBalancer.listen(basePort, () => {
    console.log(`Load balancer listening on port ${basePort}`);
  });

  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} exited`);
  });
} else {
  const port = Number(process.env.PORT) || basePort + (cluster.worker?.id ?? 0);
  usersStore.initialize(
    process.env.USERS_STATE ? (JSON.parse(process.env.USERS_STATE) as User[]) : undefined,
  );
  const server = http.createServer(requestListener);

  process.on('message', (message: { type?: string; payload?: unknown }) => {
    if (message?.type === 'sync-users') {
      usersStore.initialize(message.payload as User[]);
    }
  });

  usersStore.onChange((state) => {
    process.send?.({ type: 'sync-users', payload: state });
  });

  server.listen(port, () => {
    console.log(`Worker ${process.pid} listening on port ${port}`);
  });
}
