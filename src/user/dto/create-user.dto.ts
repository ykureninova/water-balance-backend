import { IsString, IsNumber, Min, Max, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsNumber()
  @Min(30)
  @Max(300)
  weight: number;

  @IsNumber()
  @Min(100)
  @Max(250)
  height: number;
}

export class LoginUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
