import { ApiProperty } from '@nestjs/swagger';

export class GymIdParam {
  @ApiProperty()
  gymId: string;
}

export class GymEntityIdParam extends GymIdParam {
  @ApiProperty()
  id: string;
}
