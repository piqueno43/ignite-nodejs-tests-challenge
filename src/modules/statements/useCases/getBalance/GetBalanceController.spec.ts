import request from "supertest";
import {Connection} from 'typeorm';
import createConnection from '../../../../database'
import { app } from '../../../../app';

let connection: Connection;

describe("Get Balance Controller", () => {
  beforeAll(async() =>{
    connection = await  createConnection();
    await connection.runMigrations();

    await request(app)
      .post('/api/v1/users')
      .send({
        name: 'John',
        email: 'balance@example.com',
        password: 'password'
    });
  })

  afterAll(async() => {
    await connection.dropDatabase();
    await connection.close();
  })

  it("should be able to all list to balance", async () => {
    const response = await request(app)
      .post('/api/v1/sessions')
      .send({
        email: 'balance@example.com',
        password: 'password'
    });

    const { token } = response.body

    const balance = await request(app)
      .get('/api/v1/statements/balance').set({
        Authorization: 'Bearer ' + token
      });

    expect(balance.body).toHaveProperty('balance');
  });
})
