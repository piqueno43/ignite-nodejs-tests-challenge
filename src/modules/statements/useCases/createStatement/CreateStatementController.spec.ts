import request from "supertest";
import {Connection} from 'typeorm';
import createConnection from '../../../../database'
import { app } from '../../../../app';

let connection: Connection;

describe("Create Statement Controller", () => {
  beforeAll(async() =>{
    connection = await createConnection();
    await connection.runMigrations();
  })

  afterAll(async() => {
    await connection.dropDatabase();
    await connection.close();
  })

  it("should be able to  create a new deposit", async () => {
    await request(app)
      .post('/api/v1/users')
      .send({
        name: 'John',
        email: 'deposit@example.com',
        password: 'password'
    });

    const response = await request(app)
      .post('/api/v1/sessions')
      .send({
        email: 'deposit@example.com',
        password: 'password'
    });

    const { token } = response.body

    const deposit = await request(app)
      .post('/api/v1/statements/deposit')
      .send({
        amount: 160,
        description: 'description deposit test'
      })
      .set({
        Authorization: 'Bearer ' + token
      });

       expect(deposit.status).toBe(201)
  });

  it("should be able to  create a new withdraw", async () => {
    await request(app)
      .post('/api/v1/users')
      .send({
        name: 'John',
        email: 'withdraw@example.com',
        password: 'password'
    });

    const response = await request(app)
      .post('/api/v1/sessions')
      .send({
        email: 'withdraw@example.com',
        password: 'password'
    });

    const { token } = response.body

    await request(app)
      .post('/api/v1/statements/deposit')
      .send({
        amount: 300,
        description: 'description deposit test'
      })
      .set({
        Authorization: 'Bearer ' + token
      });

    const withdraw = await request(app)
      .post('/api/v1/statements/withdraw')
      .send({
        amount: 20,
        description: 'description withdraw test'
      })
      .set({
        Authorization: 'Bearer ' + token
      });

      expect(withdraw.status).toBe(201)
  });
})
