
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'ایمیل کاربر',
    example: 'admin@example.com',
  })
  @IsEmail()
  @MaxLength(255)
  email: string;

  @ApiProperty({
    description: 'رمز عبور کاربر',
    example: 'StrongPass123!',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(72)
  password: string;
}
