import { IsOptional, IsString } from "class-validator";

export class CreatePacienteDto {
    @IsString()
  @IsOptional()
  nome?: string;

  @IsString()
  @IsOptional()
  CPF?: string;
}
