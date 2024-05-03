import { APIResponse } from '@common/types';
import { IDatabaseErrorHandler } from '@modules/database-error-handler/database.error.handler.interface';
import { CreateBatchDto } from '@modules/gym/batch/request.dto';
import {
  GymEntityIdParam,
  GymIdParam,
  PaginationDto,
} from '@modules/gym/common/dto';
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
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/prisma.service';

/////////////////////////////////////////////////////////////////////////

@ApiBearerAuth()
@ApiTags('batch')
@Controller('gyms')
export class BatchController {
  /**
   *
   */

  private _batchEntity: Prisma.BatchDelegate<DefaultArgs>;

  constructor(
    prismaService: PrismaService,
    @Inject(IDatabaseErrorHandler)
    private _databaseErrorHandler: IDatabaseErrorHandler,
  ) {
    this._batchEntity = prismaService.batch;
  }

  @ApiBody({ type: CreateBatchDto })
  @HttpCode(HttpStatus.CREATED)
  @Post(':gymId/batches')
  async create(
    @Param()
    params: GymIdParam,
    @Body() dto: CreateBatchDto,
  ): Promise<APIResponse> {
    try {
      const entity = await this._batchEntity.create({
        data: {
          name: dto.name,
          batchLimit: dto.batchLimit,
          startTime: {
            create: {
              hour: dto.startTime.hour,
              minute: dto.startTime.minute,
            },
          },
          endTime: {
            create: {
              hour: dto.endTime.hour,
              minute: dto.endTime.minute,
            },
          },
          gym: {
            connect: {
              id: params.gymId,
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
    params: GymEntityIdParam,
    @Body() dto: CreateBatchDto,
  ): Promise<APIResponse> {
    try {
      const entity = await this._batchEntity.update({
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
    params: GymIdParam,
    @Query() paginationDto: PaginationDto,
  ): Promise<APIResponse> {
    try {
      const entity = await this._batchEntity.findMany({
        where: {
          gym: {
            id: params.gymId,
          },
          deleted: null,
        },
        skip: paginationDto.offset,
        take: paginationDto.pageSize,
      });

      const count = await this._batchEntity.findMany({
        where: {
          gym: {
            id: params.gymId,
          },
          deleted: null,
        },
      });

      const apiResponse: APIResponse = {
        message: 'Plans retrieved successfully!',
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
  @Delete(':gymId/batches/:id')
  async delete(
    @Param()
    params: GymEntityIdParam,
  ): Promise<APIResponse> {
    try {
      const entity = await this._batchEntity.update({
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
