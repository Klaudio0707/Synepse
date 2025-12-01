import { IsEnum, IsOptional, IsString } from "class-validator";
import { Prioridade } from "../entities/ticket.entity";

export class CreateTicketDto {

    @IsEnum(Prioridade, { message: 'Prioridade deve ser SP, SE ou SG' })
  prioridade: Prioridade;

  @IsString()
  @IsOptional()
  nome?: string;

  @IsString()
  @IsOptional()
  cpf?: string;

  // @IsString()
  // @IsOptional()
  // telefone?: string;

  // @IsString()
  // @IsOptional()
  // cep?: string;
}
