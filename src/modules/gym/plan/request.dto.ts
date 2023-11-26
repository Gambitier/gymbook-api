import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsString, Max, Min } from 'class-validator';

export class CreatePlanDto {
  constructor(props: CreatePlanDto) {
    Object.assign(this, props);
  }

  @ApiProperty({ example: 'Six month plan' })
  @IsString()
  name: string;

  @ApiProperty({ example: 1000 })
  @IsNumber()
  price: number;

  @ApiProperty({ example: 12 })
  @IsInt()
  @Max(24)
  @Min(1)
  durationInMoths: number;
}
