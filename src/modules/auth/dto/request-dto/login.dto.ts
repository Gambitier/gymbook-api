import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDto {
  constructor(props: LoginDto) {
    Object.assign(this, props);
  }

  @ApiProperty({ example: 'user@yopmail.com' })
  @IsString({ message: "'email' must be string" })
  email: string;

  @ApiProperty({ example: 'string' })
  password: string;
}
