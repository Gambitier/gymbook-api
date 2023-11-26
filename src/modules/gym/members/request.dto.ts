import { GenderEnum } from '@modules/user/enums/gender.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsDefined,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

enum TrainingTypeEnum {
  GENERAL = 'GENERAL',
  PERSONAL = 'PERSONAL',
}

enum DiscountTypeEnum {
  AMOUNT = 'AMOUNT',
  PERCENTAGE = 'PERCENTAGE',
}

class MemberPlan {
  constructor(props: MemberPlan) {
    Object.assign(this, props);
  }

  @ApiProperty({ example: '' })
  @IsUUID()
  planId: string;

  @ApiProperty({ example: '' })
  @IsUUID()
  batchId: string;

  @ApiProperty({ example: '2022-03-15' })
  @IsDateString()
  @Transform(({ value }) => {
    if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return new Date(value);
    }
    return value;
  })
  startDate: Date;

  @ApiProperty({ enum: TrainingTypeEnum })
  @IsEnum(TrainingTypeEnum)
  trainingType: TrainingTypeEnum;

  @ApiProperty({ example: 5000 })
  admissionFees: number;

  @ApiProperty({ example: 10 })
  discount: number;

  @ApiProperty({ enum: DiscountTypeEnum })
  @IsEnum(DiscountTypeEnum)
  discountType: DiscountTypeEnum;

  @ApiProperty({
    type: () => [MemberPlanPayment],
    description: 'Array of Member Plans',
  })
  @IsDefined()
  @IsArray()
  @ArrayMinSize(1, { message: 'payments should have a minimum length of 1' })
  @ValidateNested({ each: true })
  @Type(() => MemberPlanPayment)
  payments: MemberPlanPayment[];
}

class MemberPlanPayment {
  constructor(props: MemberPlanPayment) {
    Object.assign(this, props);
  }

  @ApiProperty({ example: 1200 })
  @IsNumber()
  @Min(0)
  amountPaid: number;
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

  @ApiProperty({ example: 'test@yopmail.com' })
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

  @ApiProperty({
    type: () => [MemberPlan],
    description: 'Array of Member Plans',
  })
  @IsDefined()
  @IsArray()
  @ArrayMinSize(1, { message: 'plans should have a minimum length of 1' })
  @ValidateNested({ each: true })
  @Type(() => MemberPlan)
  plans: MemberPlan[];
}
