import { config } from 'dotenv';
import { appServer } from './app';

config();

const port = Number(process.env.PORT) || 4000;
const server = appServer();

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
