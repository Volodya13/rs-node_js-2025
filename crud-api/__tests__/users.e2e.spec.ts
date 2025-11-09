import request from 'supertest';
import { appServer } from '../src/app';
import { usersStore } from '../src/users/users.store';
import { Server } from 'http';

describe('Users API', () => {
  let server: Server;

  beforeEach((done) => {
    usersStore.initialize([]);
    server = appServer().listen(0, done);
  });

  afterEach((done) => {
    server.close(done);
  });

  it('should return empty array on GET /api/users initially', async () => {
    await request(server).get('/api/users').expect(200, []);
  });

  it('should create, retrieve, update and delete a user', async () => {
    const createResponse = await request(server)
      .post('/api/users')
      .send({ username: 'John', age: 30, hobbies: ['reading'] })
      .expect(201);

    const userId = createResponse.body.id;

    await request(server).get(`/api/users/${userId}`).expect(200, createResponse.body);

    const updated = { ...createResponse.body, username: 'Johnny', age: 31 };

    await request(server)
      .put(`/api/users/${userId}`)
      .send({ username: 'Johnny', age: 31, hobbies: ['reading'] })
      .expect(200, updated);

    await request(server).delete(`/api/users/${userId}`).expect(204);

    await request(server).get(`/api/users/${userId}`).expect(404);
  });

  it('should return 400 for invalid UUID', async () => {
    await request(server).get('/api/users/invalid').expect(400);
  });
});
