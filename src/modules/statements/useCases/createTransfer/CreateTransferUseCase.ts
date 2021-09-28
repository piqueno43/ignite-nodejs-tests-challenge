import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateTransferError } from "./CreateTransferErros";
import { ICreateTransferDTO } from "./ICreateTransferDTO";

interface IRequest  extends ICreateTransferDTO {
  sender_id: string;
}

@injectable()
export class CreateTransferUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository
  ){}
  async execute({ user_id,  type, amount, description, sender_id,  }: IRequest ) {
    const user = await this.usersRepository.findById(user_id);
    const senderUser = await this.usersRepository.findById(sender_id);

    if(!user || !senderUser) {
      throw new CreateTransferError.UserNotFound();
    }


    const { balance } = await this.statementsRepository.getUserBalance({ user_id });

    if (balance < amount) {
      throw new CreateTransferError.InsufficientFunds();
    }

    await this.statementsRepository.create({
      user_id,
      amount,
      description,
      type
    });

    const transferOperation = await this.statementsRepository.create({
      user_id,
      sender_id,
      amount,
      description,
      type
    });

    return transferOperation;

  }
}
