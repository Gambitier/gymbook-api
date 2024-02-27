import { APIResponse } from '@common/types';
import { IDatabaseErrorHandler } from '@modules/database-error-handler/database.error.handler.interface';
import { GymEntityIdParam, GymIdParam } from '@modules/gym/common/dto';
import { CreatePlanDto } from '@modules/gym/plan/request.dto';
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
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/prisma.service';

/////////////////////////////////////////////////////////////////////////

@ApiBearerAuth()
@ApiTags('plans')
@Controller('gyms')
export class PlanController {
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
    params: GymIdParam,
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

  @ApiBody({ type: CreatePlanDto })
  @HttpCode(HttpStatus.OK)
  @Put(':gymId/plans/:id')
  async updateGymPlan(
    @Param()
    params: GymEntityIdParam,
    @Body() dto: CreatePlanDto,
  ): Promise<APIResponse> {
    try {
      const entity = await this._planEntity.update({
        where: {
          id: params.id,
          gym: {
            id: params.gymId,
          },
        },
        data: {
          ...dto,
        },
      });

      const apiResponse: APIResponse = {
        message: 'Plan updated successfully!',
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
    params: GymIdParam,
  ): Promise<APIResponse> {
    try {
      const entity = await this._planEntity.findMany({
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
  @Get(':gymId/plans/:id')
  async getGymPlanById(
    @Param()
    params: GymEntityIdParam,
  ): Promise<APIResponse> {
    try {
      const entity = await this._planEntity.findFirst({
        where: {
          id: params.id,
          gym: {
            id: params.gymId,
          },
        },
      });

      const apiResponse: APIResponse = {
        message: 'Plan by id fetched successfully!',
        data: entity,
      };

      return apiResponse;
    } catch (err) {
      this._databaseErrorHandler.HandleError(err);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':gymId/plans/:id')
  async deleteGymPlan(
    @Param()
    params: GymEntityIdParam,
  ): Promise<APIResponse> {
    try {
      const entity = await this._planEntity.update({
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
        message: 'Plan deleted successfully!',
        data: entity,
      };

      return apiResponse;
    } catch (err) {
      this._databaseErrorHandler.HandleError(err);
    }
  }
}
