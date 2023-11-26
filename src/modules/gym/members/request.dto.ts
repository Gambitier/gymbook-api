import { GenderEnum } from '@modules/user/enums/gender.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

// model MemberPlan {
//   id            String              @id @default(uuid()) @db.Uuid
//   memberId      String              @db.Uuid
//   member        Member              @relation(fields: [memberId], references: [id])
//   planId        String              @db.Uuid
//   plan          Plan                @relation(fields: [planId], references: [id])
//   batchId       String              @db.Uuid
//   batch         Batch               @relation(fields: [batchId], references: [id])
//   startDate     DateTime            @db.Timestamptz(6)
//   trainingType  TrainingTypeEnum
//   admissionFees Float
//   discount      Float
//   discountType  DiscountTypeEnum
//   createdAt     DateTime            @default(now()) @db.Timestamptz(6)
//   updatedAt     DateTime            @updatedAt @db.Timestamptz(6)
//   deleted       DateTime?           @db.Timestamptz(6)
//   payments      MemberPlanPayment[]
// }

// model MemberPlanPayment {
//   id           String     @id @default(uuid()) @db.Uuid
//   amountPaid   Float
//   memberPlanId String     @db.Uuid
//   memberPlan   MemberPlan @relation(fields: [memberPlanId], references: [id])
//   createdAt    DateTime   @default(now()) @db.Timestamptz(6)
//   updatedAt    DateTime   @updatedAt @db.Timestamptz(6)
//   deleted      DateTime?  @db.Timestamptz(6)
// }

class MemberPlan {
  constructor(props: MemberPlan) {
    Object.assign(this, props);
  }

  name: string;
}

export class CreateMemberDto {
  constructor(props: CreateMemberDto) {
    Object.assign(this, props);
  }

  @ApiProperty({ example: 'Akash' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Jadhav' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: '912456789' })
  @IsString()
  @MaxLength(9)
  mobile: string;

  @ApiProperty({ example: 'IN' })
  @IsString()
  countryShortCode: string;

  @ApiProperty({ example: '+91' })
  @IsString()
  countryCode: string;

  @ApiProperty({ example: '+91' })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({ example: '1995-03-15' })
  @IsDateString()
  @Transform(({ value }) => {
    if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return new Date(value);
    }
    return value;
  })
  dob: Date;

  @ApiProperty({ enum: GenderEnum })
  @IsEnum(GenderEnum)
  gender: GenderEnum = GenderEnum.UNSPECIFIED;

  @ApiProperty({ example: '2022-03-15' })
  @IsDateString()
  @Transform(({ value }) => {
    if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return new Date(value);
    }
    return value;
  })
  dateOfJoing: Date;

  @ApiProperty({ example: 'Pune, Maharashtra' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ example: 'notes' })
  @IsString()
  @IsOptional()
  notes?: string;

  plans: MemberPlan[];
}
