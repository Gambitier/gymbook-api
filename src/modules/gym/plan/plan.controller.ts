import { APIResponse } from '@common/types';
import { IDatabaseErrorHandler } from '@modules/database-error-handler/database.error.handler.interface';
import { CreatePlanDto } from '@modules/gym/plan/request.dto';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/prisma.service';

/////////////////////////////////////////////////////////////////////////

@ApiBearerAuth()
@ApiTags('gyms')
@Controller('gyms')
export class GymController {
  /**
   *
   */

  private _planEntity: Prisma.PlanDelegate<DefaultArgs>;

  constructor(
    prismaService: PrismaService,
    @Inject(IDatabaseErrorHandler)
    private _databaseErrorHandler: IDatabaseErrorHandler,
  ) {
    this._planEntity = prismaService.plan;
  }

  @ApiBody({ type: CreatePlanDto })
  @HttpCode(HttpStatus.CREATED)
  @Post(':gymId/plans')
  async createGymPlan(
    @Param()
    params: {
      gymId: string;
    },
    @Body() dto: CreatePlanDto,
  ): Promise<APIResponse> {
    try {
      const entity = await this._planEntity.create({
        data: {
          ...dto,
          gym: {
            connect: {
              id: params.gymId,
            },
          },
        },
      });

      const apiResponse: APIResponse = {
        message: 'Plan created successfully!',
        data: entity,
      };

      return apiResponse;
    } catch (err) {
      this._databaseErrorHandler.HandleError(err);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Get(':gymId/plans')
  async getAllGymPlans(
    @Param()
    params: {
      gymId: string;
    },
  ): Promise<APIResponse> {
    try {
      const entity = await this._planEntity.findMany({
        where: {
          gym: {
            id: params.gymId,
          },
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
}
