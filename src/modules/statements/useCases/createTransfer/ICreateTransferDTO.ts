import { Statement } from "../../entities/Statement";

export type ICreateTransferDTO =
Pick<
  Statement,
  'user_id' |
  'sender_id' |
  'description' |
  'amount' |
  'type'
>
