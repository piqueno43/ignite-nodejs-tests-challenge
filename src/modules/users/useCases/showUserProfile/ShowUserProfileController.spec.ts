import request from "supertest";
import {Connection} from 'typeorm';
import createConnection from '../../../../database'
import { app } from '../../../../app';

let connection: Connection;

describe("Show user profile", () => {
  beforeAll(async() =>{
    connection = await  createConnection();
    await connection.runMigrations();

    await request(app)
      .post('/api/v1/users')
      .send({
        name: 'John',
        email: 'user@example.com',
        password: 'password'
    });
  })

  afterAll(async() => {
    await connection.dropDatabase();
    await connection.close();
  })

  it("should be able to JWT user", async () => {
    const response = await request(app)
      .post('/api/v1/sessions')
      .send({
        email: 'user@example.com',
        password: 'password'
    });

    const { token } = response.body

    const user = await request(app)
      .get('/api/v1/profile').set({
        Authorization: 'Bearer ' + token
      });

    expect(user.status).toBe(200);
    expect(user.body).toHaveProperty('id');
  })


})
