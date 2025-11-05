import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsStrongPassword } from '../validators/password-strength.validator';

export class ChangePasswordDto {
  @ApiProperty({ example: 'OldPassword123!' })
  @IsString()
  @MinLength(8)
  currentPassword: string;

  @ApiProperty({
    example: 'NewSecurePass456!',
    description:
      'Password must be at least 8 characters and contain uppercase, lowercase, number, and special character',
  })
  @IsString()
  @MinLength(8)
  @IsStrongPassword()
  newPassword: string;
}
