import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength, IsOptional, MaxLength } from 'class-validator';

export class CreateUsuarioDto {
    @IsNotEmpty()
    @IsString()
    usuarioNome: string;
  
    @IsNotEmpty()
    @IsEmail({}, { message: 'Email' })
    usuarioEmail: string;
  
    @IsNotEmpty()
    @IsString()
    @MaxLength(10, { message: 'A senha deve ter no máximo 10 caracteres' })
    @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
    usuarioSenha: string;
  
    @IsOptional({ message: 'O campo "permissao Usuario" é opcional' })
    @IsEnum(['ADMIN', 'ATENDENTE'])
    role?: string;
}