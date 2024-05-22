import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDefined,
  IsInt,
  IsNotEmptyObject,
  IsObject,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

class TimeDto {
  constructor(props: TimeDto) {
    Object.assign(this, props);
  }

  @ApiProperty({ example: 13 })
  @IsInt()
  @Min(0)
  @Max(24)
  hour: number;

  @ApiProperty({ example: 55 })
  @IsInt()
  @Min(0)
  @Max(59)
  minute: number;
}

export class CreateBatchDto {
  constructor(props: CreateBatchDto) {
    Object.assign(this, props);
  }

  @ApiProperty({ example: 'Morning batch' })
  @IsString()
  name: string;

  @ApiProperty()
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => TimeDto)
  startTime: TimeDto;

  @ApiProperty()
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => TimeDto)
  endTime: TimeDto;

  @ApiProperty({ example: 12 })
  @IsInt()
  @Min(1)
  batchLimit: number;
}
