import { APIResponse } from '@common/types';
import { IDatabaseErrorHandler } from '@modules/database-error-handler/database.error.handler.interface';
import { CreateGymhDto } from '@modules/gym/gym/request.dto';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Request,
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

  private _entity: Prisma.GymDelegate<DefaultArgs>;

  constructor(
    prismaService: PrismaService,
    @Inject(IDatabaseErrorHandler)
    private _databaseErrorHandler: IDatabaseErrorHandler,
  ) {
    this._entity = prismaService.gym;
  }

  @ApiBody({ type: CreateGymhDto })
  @HttpCode(HttpStatus.CREATED)
  @Post('')
  async create(
    @Request() req,
    @Body() dto: CreateGymhDto,
  ): Promise<APIResponse> {
    try {
      const entity = await this._entity.create({
        data: {
          name: dto.name,
          adminUser: {
            connect: {
              id: req.user.id,
            },
          },
        },
      });

      const apiResponse: APIResponse = {
        message: 'Gym created successfully!',
        data: entity,
      };

      return apiResponse;
    } catch (err) {
      this._databaseErrorHandler.HandleError(err);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Get('')
  async getAll(@Request() req): Promise<APIResponse> {
    try {
      const entity = await this._entity.findMany({
        where: {
          adminUser: {
            id: req.user.id,
          },
        },
      });

      const apiResponse: APIResponse = {
        message: 'Gyms retrieved successfully!',
        data: entity,
      };

      return apiResponse;
    } catch (err) {
      this._databaseErrorHandler.HandleError(err);
    }
  }
}
