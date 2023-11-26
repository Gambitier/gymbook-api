import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

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
