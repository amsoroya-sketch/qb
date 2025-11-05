import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsStrongPassword } from '../validators/password-strength.validator';

export class RegisterDto {
  @ApiProperty({ example: 'Ahmed Khan' })
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  name: string;

  @ApiProperty({ example: 'student@arq.com' })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'SecurePass123!',
    description:
      'Password must be at least 8 characters and contain uppercase, lowercase, number, and special character',
  })
  @IsString()
  @MinLength(8)
  @IsStrongPassword()
  password: string;
}
