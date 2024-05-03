/* eslint-disable @typescript-eslint/no-inferrable-types */
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsUUID, Min } from 'class-validator';

export class GymIdParam {
  @ApiProperty()
  @IsUUID()
  gymId: string;
}

export class GymEntityIdParam extends GymIdParam {
  @ApiProperty()
  @IsUUID()
  id: string;
}

export class PaginationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  readonly pageIndex?: number = 1;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  readonly pageSize?: number = 10;

  get offset(): number {
    return (this.pageIndex - 1) * this.pageSize;
  }
}
