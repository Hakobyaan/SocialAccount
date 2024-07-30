import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsEmail } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'First name of the user' })
  @IsString()
  readonly firstName: string;

  @ApiProperty({ description: 'Last name of the user' })
  @IsString()
  readonly lastName: string;

  @ApiProperty({ description: 'Email of the user' })
  @IsEmail()
  readonly email: string;

  @ApiProperty({ description: 'Password of the user' })
  @IsString()
  readonly password: string;

  @ApiProperty({ description: 'Age of the user' })
  @IsInt()
  readonly age: number;
}
