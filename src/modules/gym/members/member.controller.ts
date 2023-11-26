import { APIResponse } from '@common/types';
import { IDatabaseErrorHandler } from '@modules/database-error-handler/database.error.handler.interface';
import { CreateBatchDto } from '@modules/gym/batch/request.dto';
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
  Put,
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
  @Post(':gymId/batches')
  async create(
    @Param()
    params: {
      gymId: string;
    },
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
        message: 'Batch created successfully!',
        data: entity,
      };

      return apiResponse;
    } catch (err) {
      this._databaseErrorHandler.HandleError(err);
    }
  }

  @ApiBody({ type: CreateBatchDto })
  @HttpCode(HttpStatus.OK)
  @Put(':gymId/batches/:id')
  async update(
    @Param()
    params: {
      gymId: string;
      id: string;
    },
    @Body() dto: CreateBatchDto,
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
          name: dto.name,
          batchLimit: dto.batchLimit,
          startTime: {
            update: {
              hour: dto.startTime.hour,
              minute: dto.startTime.minute,
            },
          },
          endTime: {
            update: {
              hour: dto.endTime.hour,
              minute: dto.endTime.minute,
            },
          },
        },
      });

      const apiResponse: APIResponse = {
        message: 'Batch updated successfully!',
        data: entity,
      };

      return apiResponse;
    } catch (err) {
      this._databaseErrorHandler.HandleError(err);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Get(':gymId/batches')
  async getAll(
    @Param()
    params: {
      gymId: string;
    },
  ): Promise<APIResponse> {
    try {
      const entity = await this._memberEntity.findMany({
        where: {
          gym: {
            id: params.gymId,
          },
          deleted: null,
        },
      });

      const apiResponse: APIResponse = {
        message: 'Plans retrieved successfully!',
        data: entity,
      };

      return apiResponse;
    } catch (err) {
      this._databaseErrorHandler.HandleError(err);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':gymId/batches/:id')
  async delete(
    @Param()
    params: {
      gymId: string;
      id: string;
    },
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
        message: 'Batch deleted successfully!',
        data: entity,
      };

      return apiResponse;
    } catch (err) {
      this._databaseErrorHandler.HandleError(err);
    }
  }
}
