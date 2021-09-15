import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
describe("Create User", () => {
  beforeEach(() => {
    inMemoryUsersRepository= new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  })

  it("should be able to create a new user", async() => {
    const user = await createUserUseCase.execute({
      name: "John",
      email: "john@example.com",
      password: "password"
    });

    expect(user).toHaveProperty("id")
  })
})
