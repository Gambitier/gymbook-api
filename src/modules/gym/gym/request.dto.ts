import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateGymhDto {
  constructor(props: CreateGymhDto) {
    Object.assign(this, props);
  }

  @ApiProperty({ example: 'Golds Gym' })
  @IsString()
  name: string;
}
