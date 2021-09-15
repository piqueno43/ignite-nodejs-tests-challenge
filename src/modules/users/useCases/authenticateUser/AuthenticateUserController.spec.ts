import request from "supertest";
import {Connection} from 'typeorm';
import createConnection from '../../../../database'
import { app } from '../../../../app';
import { hash } from "bcryptjs";
import {v4 as uuid} from 'uuid'

let connection: Connection;
describe("Authenticate User Controller", () => {
  beforeAll(async() =>{
    connection = await  createConnection();
    await connection.runMigrations();
  })

  afterAll(async() => {
    await connection.dropDatabase();
    await connection.close();
  })

  it("should be able use with the JWT token", async () => {
    await request(app)
      .post('/api/v1/users')
      .send({
        name: 'John',
        email: 'jwt@example.com',
        password: 'password'
    });

    const response = await request(app)
      .post('/api/v1/sessions')
      .send({
        email: 'jwt@example.com',
        password: 'password'
      })
      expect(response.body).toHaveProperty('token');
  })
})
