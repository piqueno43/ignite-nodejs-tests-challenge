import request from "supertest";
import {Connection} from 'typeorm';
import createConnection from '../../../../database'
import { app } from '../../../../app';

let connection: Connection;

describe("Get Statement Operation Controller", () => {
  beforeAll(async() =>{
    connection = await  createConnection();
    await connection.runMigrations();

    await request(app)
      .post('/api/v1/users')
      .send({
        name: 'John',
        email: 'operation@example.com',
        password: 'password'
    });
  })

  afterAll(async() => {
    await connection.dropDatabase();
    await connection.close();
  })

  it("should be able to get statements in operation ", async () => {
    const response = await request(app)
      .post('/api/v1/sessions')
      .send({
        email: 'operation@example.com',
        password: 'password'
    });

    const { token } = response.body

    const operation = await request(app)
      .post('/api/v1/statements/deposit')
      .send({
        amount: 160,
        description: 'description deposit test'
      })
      .set({
        Authorization: 'Bearer ' + token
      });

      const { id } = operation.body;

      const statement = await request(app)
      .get(`/api/v1/statements/${id}`)
      .set({
        Authorization: 'Bearer ' + token
      });

      expect(statement.body).toHaveProperty('id');

  });
})
