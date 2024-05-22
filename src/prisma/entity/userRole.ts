import { UserRoleEnum } from '@modules/auth/common/user.role.enum';
import { $Enums } from '@prisma/client';

export type UserRoleEntity = {
  id: string;
  role: string | UserRoleEnum | $Enums.UserRoleEnum;
  createdAt: Date;
  updatedAt: Date;
  deleted: Date;
  userId: string;
};
