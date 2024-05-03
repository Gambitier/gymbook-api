import { APIResponse } from '@common/types';
import { IDatabaseErrorHandler } from '@modules/database-error-handler/database.error.handler.interface';
import {
  GymEntityIdParam,
  GymIdParam,
  PaginationDto,
} from '@modules/gym/common/dto';
import { CreateMemberDto } from '@modules/gym/members/request.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { $Enums, Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/prisma.service';

/////////////////////////////////////////////////////////////////////////

@ApiBearerAuth()
@ApiTags('members')
@Controller('gyms')
export class MemeberController {
  /**
   *
   */

  private _memberEntity: Prisma.MemberDelegate<DefaultArgs>;

  constructor(
    prismaService: PrismaService,
    @Inject(IDatabaseErrorHandler)
    private _databaseErrorHandler: IDatabaseErrorHandler,
  ) {
    this._memberEntity = prismaService.member;
  }

  @ApiBody({ type: CreateMemberDto })
  @HttpCode(HttpStatus.CREATED)
  @Post(':gymId/members')
  async create(
    @Param()
    params: GymIdParam,
    @Body() dto: CreateMemberDto,
  ): Promise<APIResponse> {
    try {
      const plan = dto.plans[0];

      const entity = await this._memberEntity.create({
        data: {
          firstName: dto.firstName,
          lastName: dto.lastName,
          mobile: dto.mobile,
          countryShortCode: dto.countryShortCode,
          countryCode: dto.countryCode,
          email: dto.email,
          dob: dto.dob,
          gender: dto.gender,
          dateOfJoing: dto.dateOfJoing,
          address: dto.address,
          notes: dto.notes,
          gym: {
            connect: {
              id: params.gymId,
            },
          },
          plans: {
            create: {
              planId: plan.planId,
              batchId: plan.batchId,
              startDate: plan.startDate,
              trainingType: plan.trainingType as $Enums.TrainingTypeEnum,
              admissionFees: plan.admissionFees,
              discount: plan.discount,
              discountType: plan.discountType as $Enums.DiscountTypeEnum,
              payments: {
                createMany: {
                  data: plan.payments.map((payment) => ({
                    amountPaid: payment.amountPaid,
                  })),
                },
              },
            },
          },
        },
      });

      const apiResponse: APIResponse = {
        message: 'Member created successfully!',
        data: entity,
      };

      return apiResponse;
    } catch (err) {
      this._databaseErrorHandler.HandleError(err);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Get(':gymId/members')
  async getAll(
    @Param()
    params: GymIdParam,
    @Query() paginationDto: PaginationDto,
  ): Promise<APIResponse> {
    try {
      const entity = await this._memberEntity.findMany({
        where: {
          gym: {
            id: params.gymId,
          },
          deleted: null,
        },
        skip: paginationDto.offset,
        take: paginationDto.limit,
      });

      const count = await this._memberEntity.findMany({
        where: {
          gym: {
            id: params.gymId,
          },
          deleted: null,
        },
      });

      const apiResponse: APIResponse = {
        message: 'members retrieved successfully!',
        data: {
          records: entity,
          totalRecords: count,
        },
      };

      return apiResponse;
    } catch (err) {
      this._databaseErrorHandler.HandleError(err);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':gymId/members/:id')
  async delete(
    @Param()
    params: GymEntityIdParam,
  ): Promise<APIResponse> {
    try {
      const entity = await this._memberEntity.update({
        where: {
          id: params.id,
          gym: {
            id: params.gymId,
          },
        },
        data: {
          deleted: new Date(),
        },
      });

      const apiResponse: APIResponse = {
        message: 'Member deleted successfully!',
        data: entity,
      };

      return apiResponse;
    } catch (err) {
      this._databaseErrorHandler.HandleError(err);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Get(':gymId/members/:id')
  async getById(
    @Param()
    params: GymEntityIdParam,
  ): Promise<APIResponse> {
    try {
      const entity = await this._memberEntity.findFirstOrThrow({
        where: {
          id: params.id,
          gym: {
            id: params.gymId,
          },
        },
        include: {
          plans: {
            include: {
              payments: true,
            },
          },
        },
      });

      const apiResponse: APIResponse = {
        message: 'Member retrieved successfully!',
        data: entity,
      };

      return apiResponse;
    } catch (err) {
      this._databaseErrorHandler.HandleError(err);
    }
  }
}
