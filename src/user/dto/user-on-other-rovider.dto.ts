import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserOnOtherProviderDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  name: string; // (currentProvider)
}
