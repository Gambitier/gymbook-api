import { UpdatePasswordDto } from '@modules/auth/dto';
import { IDatabaseErrorHandler } from '@modules/database-error-handler/database.error.handler.interface';
import {
  CreateUserDomainModel,
  UserDomainModel,
} from '@modules/user/domain.types/user';
import { IUserRepository } from '@modules/user/repositories/user.repo.interface';
import { Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/prisma.service';
import { UserEntity } from 'src/prisma/entity/user';

/////////////////////////////////////////////////////

@Injectable()
export class UserRepository implements IUserRepository {
  /**
   *
   */

  private _userEntity: Prisma.UserDelegate<DefaultArgs>;

  constructor(
    prismaService: PrismaService,
    @Inject(IDatabaseErrorHandler)
    private _databaseErrorHandler: IDatabaseErrorHandler,
  ) {
    this._userEntity = prismaService.user;
  }

  async updatePassword(
    userId: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<boolean> {
    try {
      await this._userEntity.update({
        where: {
          id: userId,
        },
        data: {
          password: updatePasswordDto.newPassword,
        },
      });
    } catch (err) {
      this._databaseErrorHandler.HandleError(err);
    }

    return true;
  }

  async findFirstByIdOrThrow(userId: string): Promise<UserDomainModel> {
    try {
      const entity: UserEntity = await this._userEntity.findFirstOrThrow({
        where: {
          id: userId,
          deleted: null,
        },
        include: {
          userRoles: true,
        },
      });
      return this.getUserDomainModel(entity);
    } catch (err) {
      this._databaseErrorHandler.HandleError(err);
    }
  }

  async findFirstByEmailOrThrow(email: string): Promise<UserDomainModel> {
    try {
      const entity: UserEntity = await this._userEntity.findFirstOrThrow({
        where: {
          email: email,
          deleted: null,
        },
        include: {
          userRoles: true,
        },
      });
      return this.getUserDomainModel(entity);
    } catch (err) {
      this._databaseErrorHandler.HandleError(err);
    }
  }

  async createUser(model: CreateUserDomainModel): Promise<UserDomainModel> {
    const rolesData = model.userRoles.map((item) => {
      return {
        role: item,
      };
    });

    const data: Prisma.UserCreateInput = {
      ...model,
      userRoles: {
        createMany: {
          data: rolesData,
        },
      },
    };

    try {
      const entity = await this._userEntity.create({
        data: data,
        include: {
          userRoles: true,
        },
      });
      return this.getUserDomainModel(entity);
    } catch (err) {
      this._databaseErrorHandler.HandleError(err);
    }
  }

  private getUserDomainModel(entity: UserEntity) {
    const domainModel: UserDomainModel = entity;
    return domainModel;
  }
}
